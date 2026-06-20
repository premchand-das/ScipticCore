import { ApiError } from "../utils/ApiError.js";

import { Admin } from "../modules/admin/admin.model.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Admin access token missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin || !admin.isActive) {
      throw new ApiError(401, "Unauthorized admin");
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired admin token"));
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.admin?.role !== "super_admin") {
    return next(new ApiError(403, "Super admin access required"));
  }

  next();
};
import { Admin } from "./admin.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const createAdmin = async (payload) => {
  const existingAdmin = await Admin.findOne({ email: payload.email });

  if (existingAdmin) {
    throw new ApiError(409, "Admin already exists");
  }

  const admin = await Admin.create(payload);

  return Admin.findById(admin._id).select("-password");
};

export const getAdminProfile = async (adminId) => {
  const admin = await Admin.findById(adminId).select("-password");

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return admin;
};

export const updateAdminProfile = async (adminId, payload) => {
  const admin = await Admin.findByIdAndUpdate(adminId, payload, {
    new: true,
    runValidators: true
  }).select("-password");

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return admin;
};
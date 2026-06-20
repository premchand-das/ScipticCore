import crypto from "crypto";
import { Admin } from "../admin/admin.model.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../utils/jwt.js";
import { env } from "../../config/env.js";

const createTokens = async (admin) => {
  const payload = {
    id: admin._id,
    role: admin.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  admin.refreshToken = refreshToken;
  await admin.save();

  return { accessToken, refreshToken };
};

export const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email }).select("+password +refreshToken");

  if (!admin || !admin.isActive) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await admin.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  admin.lastLoginAt = new Date();

  const tokens = await createTokens(admin);

  const safeAdmin = await Admin.findById(admin._id).select("-password");

  return {
    admin: safeAdmin,
    ...tokens
  };
};

export const refreshAdminToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const decoded = verifyRefreshToken(refreshToken);

  const admin = await Admin.findById(decoded.id).select("+refreshToken");

  if (!admin || admin.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const tokens = await createTokens(admin);

  const safeAdmin = await Admin.findById(admin._id).select("-password");

  return {
    admin: safeAdmin,
    ...tokens
  };
};

export const logoutAdmin = async (adminId) => {
  await Admin.findByIdAndUpdate(adminId, {
    $unset: { refreshToken: "" }
  });

  return true;
};

export const getCurrentAdmin = async (adminId) => {
  const admin = await Admin.findById(adminId).select("-password");

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return admin;
};

export const forgotAdminPassword = async (email) => {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return {
      message: "If this email exists, a reset link has been generated"
    };
  }

  const resetToken = admin.createPasswordResetToken();
  await admin.save({ validateBeforeSave: false });

  const resetUrl = `${env.ADMIN_RESET_URL}?token=${resetToken}`;

  // Later connect email provider.
  console.log("ADMIN PASSWORD RESET URL:", resetUrl);

  return {
    message: "Password reset link generated",
    resetUrl:
      env.NODE_ENV === "development" ? resetUrl : undefined
  };
};

export const resetAdminPassword = async ({ token, password }) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select("+passwordResetToken +passwordResetExpires");

  if (!admin) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  admin.password = password;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  admin.refreshToken = undefined;

  await admin.save();

  return true;
};
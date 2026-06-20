import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { refreshCookieOptions } from "../../utils/cookie.js";

import {
  forgotAdminPassword,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
  resetAdminPassword
} from "./auth.service.js";

export const loginController = asyncHandler(async (req, res) => {
  const result = await loginAdmin(req.validated.body);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  res.status(200).json(
    new ApiResponse(200, "Admin login successful", {
      admin: result.admin,
      accessToken: result.accessToken
    })
  );
});

export const refreshController = asyncHandler(async (req, res) => {
  const result = await refreshAdminToken(req.cookies.refreshToken);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  res.status(200).json(
    new ApiResponse(200, "Token refreshed", {
      admin: result.admin,
      accessToken: result.accessToken
    })
  );
});

export const meController = asyncHandler(async (req, res) => {
  const admin = await getCurrentAdmin(req.admin._id);

  res.status(200).json(new ApiResponse(200, "Current admin fetched", admin));
});

export const logoutController = asyncHandler(async (req, res) => {
  await logoutAdmin(req.admin._id);

  res.clearCookie("refreshToken", refreshCookieOptions);

  res.status(200).json(new ApiResponse(200, "Admin logout successful"));
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const result = await forgotAdminPassword(req.validated.body.email);

  res.status(200).json(new ApiResponse(200, result.message, result));
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  await resetAdminPassword(req.validated.body);

  res.status(200).json(new ApiResponse(200, "Password reset successful"));
});
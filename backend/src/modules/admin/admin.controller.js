import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createAdmin,
  getAdminProfile,
  updateAdminProfile
} from "./admin.service.js";

export const createAdminController = asyncHandler(async (req, res) => {
  const admin = await createAdmin(req.validated.body);

  res.status(201).json(new ApiResponse(201, "Admin created", admin));
});

export const getMeController = asyncHandler(async (req, res) => {
  const admin = await getAdminProfile(req.admin._id);

  res.status(200).json(new ApiResponse(200, "Admin profile fetched", admin));
});

export const updateMeController = asyncHandler(async (req, res) => {
  const admin = await updateAdminProfile(req.admin._id, req.validated.body);

  res.status(200).json(new ApiResponse(200, "Admin profile updated", admin));
});
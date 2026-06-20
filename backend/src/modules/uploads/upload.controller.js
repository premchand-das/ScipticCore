import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadImageToCloudinary } from "./upload.service.js";

export const uploadImageController = asyncHandler(async (req, res) => {
  const result = await uploadImageToCloudinary(req.file);

  res.status(201).json(new ApiResponse(201, "Image uploaded", result));
});
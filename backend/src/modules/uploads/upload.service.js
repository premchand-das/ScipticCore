import { cloudinary } from "../../config/cloudinary.js";
import { ApiError } from "../../utils/ApiError.js";

export const uploadImageToCloudinary = async (file, folder = "skepticcore") => {
  if (!file) {
    throw new ApiError(400, "Image file is required");
  }

  const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder,
    resource_type: "image"
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes
  };
};
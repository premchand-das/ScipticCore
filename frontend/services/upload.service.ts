import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export interface UploadImageResponse {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post<ApiResponse<UploadImageResponse>>(
    "/uploads/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data;
}
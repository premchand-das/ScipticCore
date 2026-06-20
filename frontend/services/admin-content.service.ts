import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type {
  AdminContentCollection,
  AdminContentItem,
  AdminContentListResponse,
  AdminContentPayload,
} from "@/types/content";

export async function getAdminContentList(
  collection: AdminContentCollection,
  params?: Record<string, string | number | undefined>
) {
  const res = await api.get<ApiResponse<AdminContentListResponse>>(
    `/${collection}/admin/list`,
    { params }
  );

  return res.data.data;
}

export async function getAdminContentById(
  collection: AdminContentCollection,
  id: string
) {
  const res = await api.get<ApiResponse<AdminContentItem>>(
    `/${collection}/admin/${id}`
  );

  return res.data.data;
}

export async function createAdminContent(
  collection: AdminContentCollection,
  payload: AdminContentPayload
) {
  const res = await api.post<ApiResponse<AdminContentItem>>(
    `/${collection}`,
    payload
  );

  return res.data.data;
}

export async function updateAdminContent(
  collection: AdminContentCollection,
  id: string,
  payload: Partial<AdminContentPayload>
) {
  const res = await api.patch<ApiResponse<AdminContentItem>>(
    `/${collection}/${id}`,
    payload
  );

  return res.data.data;
}

export async function deleteAdminContent(
  collection: AdminContentCollection,
  id: string
) {
  await api.delete(`/${collection}/${id}`);
}

export async function publishAdminContent(
  collection: AdminContentCollection,
  id: string
) {
  const res = await api.patch<ApiResponse<AdminContentItem>>(
    `/${collection}/${id}/publish`
  );

  return res.data.data;
}

export async function unpublishAdminContent(
  collection: AdminContentCollection,
  id: string
) {
  const res = await api.patch<ApiResponse<AdminContentItem>>(
    `/${collection}/${id}/unpublish`
  );

  return res.data.data;
}
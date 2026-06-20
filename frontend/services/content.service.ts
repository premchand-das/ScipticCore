import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { ContentItem, ContentType } from "@/types/content";

function normalizeList(data: any): ContentItem[] {
  const payload = data?.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.docs)) return payload.docs;
  if (Array.isArray(payload?.content)) return payload.content;

  return [];
}

function normalizeItem(data: any): ContentItem | null {
  const payload = data?.data;

  if (payload?.item) return payload.item;
  if (payload?.content) return payload.content;
  if (payload?._id) return payload;

  return null;
}

export async function getContentList(type: ContentType) {
  const res = await api.get<ApiResponse<any>>(`/${type}`);
  return normalizeList(res.data);
}

export async function getContentBySlug(type: ContentType, slug: string) {
  const res = await api.get<ApiResponse<any>>(`/${type}/${slug}`);
  return normalizeItem(res.data);
}

export async function searchContent(query: string) {
  const res = await api.get<ApiResponse<any>>("/search", {
    params: { q: query },
  });

  return normalizeList(res.data);
}
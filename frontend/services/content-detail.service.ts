import api from "@/lib/api";
import type { ContentItem, ContentType } from "@/types/content";

export async function getContentBySlug(
  type: ContentType,
  slug: string
): Promise<ContentItem> {
  const res = await api.get(`/${type}/${slug}`);
  return res.data.data;
}
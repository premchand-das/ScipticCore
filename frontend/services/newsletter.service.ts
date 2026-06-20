import api from "@/lib/api";
import type { NewsletterResponse } from "@/types/newsletter";

export async function fetchNewsletterSubscribers(params?: {
  page?: number;
  limit?: number;
  status?: "active" | "inactive" | "all";
}) {
  const cleanParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 30,
    ...(params?.status && params.status !== "all"
      ? { status: params.status }
      : {}),
  };

  const res = await api.get("/newsletter/admin/subscribers", {
    params: cleanParams,
  });

  return res.data.data as NewsletterResponse;
}
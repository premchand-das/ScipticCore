import api from "@/lib/api";
import type { AuditResponse } from "@/types/audit";

export async function fetchAuditLogs(params?: {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  admin?: string;
}) {
  const res = await api.get("/audit", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 30,
      action: params?.action || undefined,
      entity: params?.entity || undefined,
      admin: params?.admin || undefined,
    },
  });

  return res.data.data as AuditResponse;
}
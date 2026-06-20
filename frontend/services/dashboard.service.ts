import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { DashboardOverview } from "@/types/dashboard";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const res = await api.get<ApiResponse<DashboardOverview>>("/dashboard");
  return res.data.data;
}
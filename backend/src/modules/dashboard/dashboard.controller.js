import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getAdminDashboardOverview } from "./dashboard.service.js";

export const getAdminDashboardController = asyncHandler(async (req, res) => {
  const result = await getAdminDashboardOverview();

  res.status(200).json(new ApiResponse(200, "Dashboard overview fetched", result));
});
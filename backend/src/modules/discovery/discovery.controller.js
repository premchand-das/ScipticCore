import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getHomeDiscovery } from "./discovery.service.js";

export const getHomeDiscoveryController = asyncHandler(async (req, res) => {
  const result = await getHomeDiscovery();

  res.status(200).json(new ApiResponse(200, "Home discovery fetched", result));
});
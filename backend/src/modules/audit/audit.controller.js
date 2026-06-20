import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getAuditLogs } from "./audit.service.js";

export const getAuditLogsController = asyncHandler(async (req, res) => {
  const result = await getAuditLogs(req.query);

  res.status(200).json(new ApiResponse(200, "Audit logs fetched", result));
});
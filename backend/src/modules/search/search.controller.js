import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { globalSearch } from "./search.service.js";

export const publicSearchController = asyncHandler(async (req, res) => {
  const result = await globalSearch({
    query: req.query,
    publicOnly: true
  });

  res.status(200).json(new ApiResponse(200, "Search results fetched", result));
});

export const adminSearchController = asyncHandler(async (req, res) => {
  const result = await globalSearch({
    query: req.query,
    publicOnly: false
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Admin search results fetched", result));
});
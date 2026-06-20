import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getSitemapEntries } from "./seo.service.js";

export const getSitemapController = asyncHandler(async (req, res) => {
  const result = await getSitemapEntries();

  res.status(200).json(new ApiResponse(200, "Sitemap entries fetched", result));
});
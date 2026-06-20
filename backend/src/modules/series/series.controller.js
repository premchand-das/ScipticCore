import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createSeries,
  deleteSeries,
  getAdminSeriesList,
  getPublicSeriesList,
  getSeriesBySlug,
  publishSeries,
  unpublishSeries,
  updateSeries
} from "./series.service.js";

export const createSeriesController = asyncHandler(async (req, res) => {
  const series = await createSeries(req.validated.body, req.admin._id);

  res.status(201).json(new ApiResponse(201, "Series created", series));
});

export const getPublicSeriesController = asyncHandler(async (req, res) => {
  const result = await getPublicSeriesList(req.query);

  res.status(200).json(new ApiResponse(200, "Series fetched", result));
});

export const getAdminSeriesController = asyncHandler(async (req, res) => {
  const result = await getAdminSeriesList(req.query);

  res.status(200).json(new ApiResponse(200, "Admin series fetched", result));
});

export const getSeriesBySlugController = asyncHandler(async (req, res) => {
  const series = await getSeriesBySlug(req.params.slug);

  res.status(200).json(new ApiResponse(200, "Series fetched", series));
});

export const updateSeriesController = asyncHandler(async (req, res) => {
  const series = await updateSeries(
    req.params.id,
    req.validated.body,
    req.admin._id
  );

  res.status(200).json(new ApiResponse(200, "Series updated", series));
});

export const deleteSeriesController = asyncHandler(async (req, res) => {
  await deleteSeries(req.params.id);

  res.status(200).json(new ApiResponse(200, "Series deleted"));
});

export const publishSeriesController = asyncHandler(async (req, res) => {
  const series = await publishSeries(req.params.id, req.admin._id);

  res.status(200).json(new ApiResponse(200, "Series published", series));
});

export const unpublishSeriesController = asyncHandler(async (req, res) => {
  const series = await unpublishSeries(req.params.id, req.admin._id);

  res.status(200).json(new ApiResponse(200, "Series unpublished", series));
});
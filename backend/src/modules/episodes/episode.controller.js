import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  createEpisode,
  deleteEpisode,
  getAdminEpisodesList,
  getEpisodeBySlug,
  getPublicEpisodesList,
  publishEpisode,
  unpublishEpisode,
  updateEpisode
} from "./episode.service.js";

export const createEpisodeController = asyncHandler(async (req, res) => {
  const episode = await createEpisode(req.validated.body, req.admin._id);

  res.status(201).json(new ApiResponse(201, "Episode created", episode));
});

export const getPublicEpisodesController = asyncHandler(async (req, res) => {
  const result = await getPublicEpisodesList(req.query);

  res.status(200).json(new ApiResponse(200, "Episodes fetched", result));
});

export const getAdminEpisodesController = asyncHandler(async (req, res) => {
  const result = await getAdminEpisodesList(req.query);

  res.status(200).json(new ApiResponse(200, "Admin episodes fetched", result));
});

export const getEpisodeBySlugController = asyncHandler(async (req, res) => {
  const episode = await getEpisodeBySlug(req.params.slug);

  res.status(200).json(new ApiResponse(200, "Episode fetched", episode));
});

export const updateEpisodeController = asyncHandler(async (req, res) => {
  const episode = await updateEpisode(
    req.params.id,
    req.validated.body,
    req.admin._id
  );

  res.status(200).json(new ApiResponse(200, "Episode updated", episode));
});

export const deleteEpisodeController = asyncHandler(async (req, res) => {
  await deleteEpisode(req.params.id);

  res.status(200).json(new ApiResponse(200, "Episode deleted"));
});

export const publishEpisodeController = asyncHandler(async (req, res) => {
  const episode = await publishEpisode(req.params.id, req.admin._id);

  res.status(200).json(new ApiResponse(200, "Episode published", episode));
});

export const unpublishEpisodeController = asyncHandler(async (req, res) => {
  const episode = await unpublishEpisode(req.params.id, req.admin._id);

  res.status(200).json(new ApiResponse(200, "Episode unpublished", episode));
});
import express from "express";

import {
  createEpisodeController,
  deleteEpisodeController,
  getAdminEpisodesController,
  getEpisodeBySlugController,
  getPublicEpisodesController,
  publishEpisodeController,
  unpublishEpisodeController,
  updateEpisodeController
} from "./episode.controller.js";

import { protectAdmin } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  mongoIdParamSchema,
  slugParamSchema
} from "../shared/content.validation.js";

import {
  createEpisodeSchema,
  updateEpisodeSchema
} from "./episode.validation.js";

const router = express.Router();

router.get("/", getPublicEpisodesController);

router.get(
  "/admin/list",
  protectAdmin,
  getAdminEpisodesController
);

router.get(
  "/:slug",
  validate(slugParamSchema),
  getEpisodeBySlugController
);

router.post(
  "/",
  protectAdmin,
  validate(createEpisodeSchema),
  createEpisodeController
);

router.patch(
  "/:id",
  protectAdmin,
  validate(mongoIdParamSchema),
  validate(updateEpisodeSchema),
  updateEpisodeController
);

router.delete(
  "/:id",
  protectAdmin,
  validate(mongoIdParamSchema),
  deleteEpisodeController
);

router.patch(
  "/:id/publish",
  protectAdmin,
  validate(mongoIdParamSchema),
  publishEpisodeController
);

router.patch(
  "/:id/unpublish",
  protectAdmin,
  validate(mongoIdParamSchema),
  unpublishEpisodeController
);

export default router;
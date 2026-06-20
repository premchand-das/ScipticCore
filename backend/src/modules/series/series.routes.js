import express from "express";

import {
  createSeriesController,
  deleteSeriesController,
  getAdminSeriesController,
  getPublicSeriesController,
  getSeriesBySlugController,
  publishSeriesController,
  unpublishSeriesController,
  updateSeriesController
} from "./series.controller.js";

import { protectAdmin } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  mongoIdParamSchema,
  slugParamSchema
} from "../shared/content.validation.js";

import {
  createSeriesSchema,
  updateSeriesSchema
} from "./series.validation.js";

const router = express.Router();

router.get("/", getPublicSeriesController);
router.get("/admin/list", protectAdmin, getAdminSeriesController);

router.get(
  "/:slug",
  validate(slugParamSchema),
  getSeriesBySlugController
);

router.post(
  "/",
  protectAdmin,
  validate(createSeriesSchema),
  createSeriesController
);

router.patch(
  "/:id",
  protectAdmin,
  validate(mongoIdParamSchema),
  validate(updateSeriesSchema),
  updateSeriesController
);

router.delete(
  "/:id",
  protectAdmin,
  validate(mongoIdParamSchema),
  deleteSeriesController
);

router.patch(
  "/:id/publish",
  protectAdmin,
  validate(mongoIdParamSchema),
  publishSeriesController
);

router.patch(
  "/:id/unpublish",
  protectAdmin,
  validate(mongoIdParamSchema),
  unpublishSeriesController
);

export default router;
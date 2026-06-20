import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import {auditAction} from "../middleware/audit.middleware.js";

import seriesRoutes from "../modules/series/series.routes.js";
import episodeRoutes from "../modules/episodes/episode.routes.js";
import articleRoutes from "../modules/articles/article.routes.js";
import paperRoutes from "../modules/papers/paper.routes.js";
import archiveRoutes from "../modules/archive/archive.routes.js";
import dogmaRoutes from "../modules/dogmas/dogma.routes.js";
import newsletterRoutes from "../modules/newsletter/newsletter.routes.js";
import discoveryRoutes from "../modules/discovery/discovery.routes.js";

import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import searchRoutes from "../modules/search/search.routes.js";
import seoRoutes from "../modules/seo/seo.routes.js";
import healthRoutes from "../modules/health/health.routes.js";

import auditRoutes from "../modules/audit/audit.routes.js";
import uploadRoutes from "../modules/uploads/upload.routes.js";
import { protectAdmin } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { createArticleSchema } from "../modules/articles/article.validation.js";
import { articleController } from "../modules/articles/article.controller.js";

const router = express.Router();

router.post(
  "/",
  protectAdmin,
  auditAction("create", "Article"),
  validate(createArticleSchema),
  articleController.create
);

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);


router.use("/series", seriesRoutes);
router.use("/episodes", episodeRoutes);
router.use("/articles", articleRoutes);
router.use("/papers", paperRoutes);
router.use("/archive", archiveRoutes);
router.use("/dogmas", dogmaRoutes);

router.use("/newsletter", newsletterRoutes);
router.use("/discovery", discoveryRoutes);

router.use("/dashboard", dashboardRoutes);
router.use("/search", searchRoutes);
router.use("/seo", seoRoutes);
router.use("/health", healthRoutes);

router.use("/audit", auditRoutes);
router.use("/uploads", uploadRoutes);


export default router;
import express from "express";
import { getSitemapController } from "./seo.controller.js";

const router = express.Router();

router.get("/sitemap", getSitemapController);

export default router;
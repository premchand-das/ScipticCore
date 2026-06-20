import express from "express";
import { protectAdmin } from "../../middleware/auth.middleware.js";
import { getAdminDashboardController } from "./dashboard.controller.js";

const router = express.Router();

router.get("/", protectAdmin, getAdminDashboardController);

export default router;
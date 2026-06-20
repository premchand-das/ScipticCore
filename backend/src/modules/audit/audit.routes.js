import express from "express";
import { protectAdmin, requireSuperAdmin } from "../../middleware/auth.middleware.js";
import { getAuditLogsController } from "./audit.controller.js";

const router = express.Router();

router.get("/", protectAdmin, requireSuperAdmin, getAuditLogsController);

export default router;
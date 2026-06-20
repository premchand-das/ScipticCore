import express from "express";
import { protectAdmin } from "../../middleware/auth.middleware.js";
import {
  adminSearchController,
  publicSearchController
} from "./search.controller.js";

const router = express.Router();

router.get("/", publicSearchController);
router.get("/admin", protectAdmin, adminSearchController);

export default router;
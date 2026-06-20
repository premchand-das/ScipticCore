import express from "express";
import {
  createAdminController,
  getMeController,
  updateMeController
} from "./admin.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  protectAdmin,
  requireSuperAdmin
} from "../../middleware/auth.middleware.js";
import {
  createAdminSchema,
  updateAdminProfileSchema
} from "./admin.validation.js";

const router = express.Router();

router.post(
  "/create",
  protectAdmin,
  requireSuperAdmin,
  validate(createAdminSchema),
  createAdminController
);

router.get("/me", protectAdmin, getMeController);

router.patch(
  "/me",
  protectAdmin,
  validate(updateAdminProfileSchema),
  updateMeController
);

export default router;
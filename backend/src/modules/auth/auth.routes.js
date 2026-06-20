import express from "express";

import {
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  refreshController,
  resetPasswordController
} from "./auth.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { protectAdmin } from "../../middleware/auth.middleware.js";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema
} from "./auth.validation.js";
import { authRateLimiter } from "../../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/login", authRateLimiter, validate(loginSchema), loginController);
router.post("/refresh", refreshController);
router.get("/me", protectAdmin, meController);
router.post("/logout", protectAdmin, logoutController);

router.post(
  "/forgot-password",
  authRateLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordController
);

router.post(
  "/reset-password",
  authRateLimiter,
  validate(resetPasswordSchema),
  resetPasswordController
);

export default router;
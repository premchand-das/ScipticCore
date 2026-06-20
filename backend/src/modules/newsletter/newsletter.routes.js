import express from "express";

import {
  getNewsletterSubscribersController,
  subscribeNewsletterController
} from "./newsletter.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { protectAdmin } from "../../middleware/auth.middleware.js";
import { subscribeNewsletterSchema } from "./newsletter.validation.js";

const router = express.Router();

router.post(
  "/subscribe",
  validate(subscribeNewsletterSchema),
  subscribeNewsletterController
);

router.get(
  "/admin/subscribers",
  protectAdmin,
  getNewsletterSubscribersController
);

export default router;
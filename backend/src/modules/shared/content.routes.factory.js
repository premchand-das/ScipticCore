import express from "express";
import { protectAdmin } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  mongoIdParamSchema,
  slugParamSchema
} from "./content.validation.js";

export const createContentRoutes = ({
  controller,
  createSchema,
  updateSchema
}) => {
  const router = express.Router();

  router.get("/", controller.getPublicList);

  router.get("/admin/list", protectAdmin, controller.getAdminList);

  router.get(
  "/admin/:id",
  protectAdmin,
  validate(mongoIdParamSchema),
  controller.getAdminById
);

  router.get(
    "/:slug",
    validate(slugParamSchema),
    controller.getBySlug
  );

  router.post(
    "/",
    protectAdmin,
    validate(createSchema),
    controller.create
  );

  router.patch(
    "/:id",
    protectAdmin,
    validate(mongoIdParamSchema),
    validate(updateSchema),
    controller.update
  );

  router.delete(
    "/:id",
    protectAdmin,
    validate(mongoIdParamSchema),
    controller.remove
  );

  router.patch(
    "/:id/publish",
    protectAdmin,
    validate(mongoIdParamSchema),
    controller.publish
  );
  

  router.patch(
    "/:id/unpublish",
    protectAdmin,
    validate(mongoIdParamSchema),
    controller.unpublish
  );

  return router;
};
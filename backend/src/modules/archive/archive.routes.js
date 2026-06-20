import { createContentRoutes } from "../shared/content.routes.factory.js";
import {
  createArchiveSchema,
  updateArchiveSchema
} from "./archive.validation.js";
import { archiveController } from "./archive.controller.js";

export default createContentRoutes({
  controller: archiveController,
  createSchema: createArchiveSchema,
  updateSchema: updateArchiveSchema
});
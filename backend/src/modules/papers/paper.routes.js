import { createContentRoutes } from "../shared/content.routes.factory.js";
import {
  createPaperSchema,
  updatePaperSchema
} from "./paper.validation.js";
import { paperController } from "./paper.controller.js";

export default createContentRoutes({
  controller: paperController,
  createSchema: createPaperSchema,
  updateSchema: updatePaperSchema
});
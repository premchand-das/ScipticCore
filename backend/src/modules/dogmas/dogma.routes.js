import { createContentRoutes } from "../shared/content.routes.factory.js";
import {
  createDogmaSchema,
  updateDogmaSchema
} from "./dogma.validation.js";
import { dogmaController } from "./dogma.controller.js";

export default createContentRoutes({
  controller: dogmaController,
  createSchema: createDogmaSchema,
  updateSchema: updateDogmaSchema
});
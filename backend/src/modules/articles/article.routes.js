import { createContentRoutes } from "../shared/content.routes.factory.js";
import {
  createArticleSchema,
  updateArticleSchema
} from "./article.validation.js";
import { articleController } from "./article.controller.js";

export default createContentRoutes({
  controller: articleController,
  createSchema: createArticleSchema,
  updateSchema: updateArticleSchema
});
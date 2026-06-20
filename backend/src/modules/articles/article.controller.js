import { createContentController } from "../shared/content.controller.factory.js";
import { articleService } from "./article.service.js";

export const articleController = createContentController(
  articleService,
  "Article"
);
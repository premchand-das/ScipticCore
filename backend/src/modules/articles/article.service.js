import { Article } from "./article.model.js";
import { createContentService } from "../shared/content.factory.js";

export const articleService = createContentService(Article, "Article");

export default articleService;
import { z } from "zod";
import {
  createContentSchema,
  updateContentSchema
} from "../shared/content.validation.js";

export const createArticleSchema = createContentSchema.extend({
  body: createContentSchema.shape.body.extend({
    authorName: z.string().optional()
  })
});

export const updateArticleSchema = updateContentSchema.extend({
  body: updateContentSchema.shape.body.extend({
    authorName: z.string().optional()
  })
});

export default {
  createArticleSchema,
  updateArticleSchema
};
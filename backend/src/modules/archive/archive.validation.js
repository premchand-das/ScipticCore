import { z } from "zod";
import {
  createContentSchema,
  updateContentSchema
} from "../shared/content.validation.js";

export const createArchiveSchema = createContentSchema.extend({
  body: createContentSchema.shape.body.extend({
    originalPlatform: z.string().optional(),
    originalUrl: z.string().optional(),
    archivedFrom: z.string().datetime().optional()
  })
});

export const updateArchiveSchema = updateContentSchema.extend({
  body: updateContentSchema.shape.body.extend({
    originalPlatform: z.string().optional(),
    originalUrl: z.string().optional(),
    archivedFrom: z.string().datetime().optional()
  })
});
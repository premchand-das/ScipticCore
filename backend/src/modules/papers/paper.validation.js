import { z } from "zod";
import {
  createContentSchema,
  updateContentSchema
} from "../shared/content.validation.js";

export const createPaperSchema = createContentSchema.extend({
  body: createContentSchema.shape.body.extend({
    authors: z.array(z.string()).optional(),
    journal: z.string().optional(),
    doi: z.string().optional(),
    pdfUrl: z.string().optional()
  })
});

export const updatePaperSchema = updateContentSchema.extend({
  body: updateContentSchema.shape.body.extend({
    authors: z.array(z.string()).optional(),
    journal: z.string().optional(),
    doi: z.string().optional(),
    pdfUrl: z.string().optional()
  })
});
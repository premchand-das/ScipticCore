import { z } from "zod";
import {
  createContentSchema,
  updateContentSchema
} from "../shared/content.validation.js";

export const createSeriesSchema = createContentSchema.extend({
  body: createContentSchema.shape.body.extend({
    season: z.string().optional(),
    totalEpisodes: z.number().min(0).optional()
  })
});

export const updateSeriesSchema = updateContentSchema.extend({
  body: updateContentSchema.shape.body.extend({
    season: z.string().optional(),
    totalEpisodes: z.number().min(0).optional()
  })
});
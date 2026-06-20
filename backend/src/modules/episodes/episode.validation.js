import { z } from "zod";
import {
  createContentSchema,
  updateContentSchema
} from "../shared/content.validation.js";

export const createEpisodeSchema = createContentSchema.extend({
  body: createContentSchema.shape.body.extend({
    series: z.string().min(10),
    episodeNumber: z.number().min(1),
    duration: z.string().optional(),
    videoUrl: z.string().optional(),
    transcript: z.string().optional()
  })
});

export const updateEpisodeSchema = updateContentSchema.extend({
  body: updateContentSchema.shape.body.extend({
    series: z.string().min(10).optional(),
    episodeNumber: z.number().min(1).optional(),
    duration: z.string().optional(),
    videoUrl: z.string().optional(),
    transcript: z.string().optional()
  })
});
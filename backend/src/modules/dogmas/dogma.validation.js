import { z } from "zod";
import {
  createContentSchema,
  updateContentSchema
} from "../shared/content.validation.js";

export const createDogmaSchema = createContentSchema.extend({
  body: createContentSchema.shape.body.extend({
    religion: z.string().optional(),
    tradition: z.string().optional(),
    claim: z.string().optional(),
    analysisAngle: z.array(z.string()).optional(),
    sensitivityLevel: z.enum(["low", "medium", "high"]).optional()
  })
});

export const updateDogmaSchema = updateContentSchema.extend({
  body: updateContentSchema.shape.body.extend({
    religion: z.string().optional(),
    tradition: z.string().optional(),
    claim: z.string().optional(),
    analysisAngle: z.array(z.string()).optional(),
    sensitivityLevel: z.enum(["low", "medium", "high"]).optional()
  })
});
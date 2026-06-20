import { z } from "zod";

export const subscribeNewsletterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().optional(),
    source: z.string().optional()
  })
});
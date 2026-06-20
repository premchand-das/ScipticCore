import { z } from "zod";

const sourceSchema = z.object({
  title: z.string().optional(),
  url: z.string().url().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  publishedAt: z.string().datetime().optional()
});

export const createContentSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    slug: z.string().min(2).optional(),
    type: z.string().min(2),
    category: z.string().min(2),
    hook: z.string().optional(),
    summary: z.string().optional(),
    body: z.string().optional(),
    sources: z.array(sourceSchema).optional(),
    tags: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    readingTime: z.number().min(1).optional(),
    publishedAt: z.string().datetime().optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
    isFeatured: z.boolean().optional(),
    order: z.number().optional(),
    seo: z
  .object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    canonicalUrl: z.string().optional(),
    ogImage: z.string().optional()
  })
  .optional(),

visibility: z.enum(["public", "private", "unlisted"]).optional(),

contentFormat: z
  .enum(["essay", "reel", "carousel", "paper", "note", "video", "archive"])
  .optional(),

difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),

estimatedMinutes: z.number().min(1).optional()
  })
});

export const updateContentSchema = z.object({
  body: createContentSchema.shape.body.partial()
});

export const mongoIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(10)
  })
});

export const slugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(2)
  })
});
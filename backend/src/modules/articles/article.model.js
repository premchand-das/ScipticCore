import mongoose from "mongoose";
import { contentBaseFields } from "../shared/content.schema.js";

const articleSchema = new mongoose.Schema(
  {
    ...contentBaseFields,

    authorName: {
      type: String,
      trim: true,
      default: "SkepticCore"
    }
  },
  { timestamps: true }
);

articleSchema.index({
  title: "text",
  hook: "text",
  summary: "text",
  body: "text",
  tags: "text"
});

export const Article =
  mongoose.models.Article || mongoose.model("Article", articleSchema);
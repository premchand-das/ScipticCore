import mongoose from "mongoose";
import { contentBaseFields } from "../shared/content.schema.js";

const archiveSchema = new mongoose.Schema(
  {
    ...contentBaseFields,

    originalPlatform: {
      type: String,
      trim: true
    },

    originalUrl: {
      type: String,
      trim: true
    },

    archivedFrom: {
      type: Date
    }
  },
  { timestamps: true }
);

archiveSchema.index({
  title: "text",
  hook: "text",
  summary: "text",
  body: "text",
  tags: "text",
  originalPlatform: "text"
});

export const Archive =
  mongoose.models.Archive || mongoose.model("Archive", archiveSchema);
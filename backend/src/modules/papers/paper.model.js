import mongoose from "mongoose";
import { contentBaseFields } from "../shared/content.schema.js";

const paperSchema = new mongoose.Schema(
  {
    ...contentBaseFields,

    authors: {
      type: [String],
      default: []
    },

    journal: {
      type: String,
      trim: true
    },

    doi: {
      type: String,
      trim: true
    },

    pdfUrl: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

paperSchema.index({
  title: "text",
  hook: "text",
  summary: "text",
  body: "text",
  tags: "text",
  authors: "text",
  journal: "text"
});

export const Paper =
  mongoose.models.Paper || mongoose.model("Paper", paperSchema);
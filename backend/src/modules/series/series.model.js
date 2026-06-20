import mongoose from "mongoose";
import { contentBaseFields } from "../shared/content.schema.js";

const seriesSchema = new mongoose.Schema(
  {
    ...contentBaseFields,

    season: {
      type: String,
      trim: true
    },

    totalEpisodes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

seriesSchema.index({
  title: "text",
  hook: "text",
  summary: "text",
  body: "text",
  tags: "text"
});

export const Series =
  mongoose.models.Series || mongoose.model("Series", seriesSchema);
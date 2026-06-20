import mongoose from "mongoose";
import { contentBaseFields } from "../shared/content.schema.js";

const episodeSchema = new mongoose.Schema(
  {
    ...contentBaseFields,

    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
      required: true,
      index: true
    },

    episodeNumber: {
      type: Number,
      required: true,
      min: 1,
      index: true
    },

    duration: {
      type: String,
      trim: true
    },

    videoUrl: {
      type: String,
      trim: true
    },

    transcript: {
      type: String
    }
  },
  { timestamps: true }
);

episodeSchema.index({
  title: "text",
  hook: "text",
  summary: "text",
  body: "text",
  tags: "text",
  transcript: "text"
});

episodeSchema.index({ series: 1, episodeNumber: 1 }, { unique: true });
episodeSchema.index({ series: 1, order: 1 });

export const Episode =
  mongoose.models.Episode || mongoose.model("Episode", episodeSchema);
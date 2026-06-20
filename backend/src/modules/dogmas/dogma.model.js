import mongoose from "mongoose";
import { contentBaseFields } from "../shared/content.schema.js";

const dogmaSchema = new mongoose.Schema(
  {
    ...contentBaseFields,

    religion: {
      type: String,
      trim: true,
      index: true
    },

    tradition: {
      type: String,
      trim: true
    },

    claim: {
      type: String,
      trim: true
    },

    analysisAngle: {
      type: [String],
      default: []
    },

    sensitivityLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    }
  },
  { timestamps: true }
);

dogmaSchema.index({
  title: "text",
  hook: "text",
  summary: "text",
  body: "text",
  tags: "text",
  religion: "text",
  claim: "text"
});

export const Dogma =
  mongoose.models.Dogma || mongoose.model("Dogma", dogmaSchema);
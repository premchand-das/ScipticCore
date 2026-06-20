import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    name: {
      type: String,
      trim: true
    },

    source: {
      type: String,
      trim: true,
      default: "website"
    },

    isSubscribed: {
      type: Boolean,
      default: true,
      index: true
    },

    subscribedAt: {
      type: Date,
      default: Date.now
    },

    unsubscribedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model("NewsletterSubscriber", newsletterSchema);
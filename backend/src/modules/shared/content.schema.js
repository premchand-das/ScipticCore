import mongoose from "mongoose";

export const sourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    author: {
      type: String,
      trim: true
    },
    publisher: {
      type: String,
      trim: true
    },
    publishedAt: {
      type: Date
    }
  },
  { _id: false }
);

export const contentBaseFields = {
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  type: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  hook: {
    type: String,
    trim: true
  },

  summary: {
    type: String,
    trim: true
  },

  body: {
    type: String
  },

  sources: {
    type: [sourceSchema],
    default: []
  },

  tags: {
    type: [String],
    default: [],
    index: true
  },

  thumbnail: {
    type: String,
    trim: true
  },

  readingTime: {
    type: Number,
    default: 1,
    min: 1
  },

  publishedAt: {
    type: Date
  },

  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
    index: true
  },

  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },

  order: {
    type: Number,
    default: 0,
    index: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  seo: {
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  canonicalUrl: {
    type: String,
    trim: true
  },
  ogImage: {
    type: String,
    trim: true
  }
},

visibility: {
  type: String,
  enum: ["public", "private", "unlisted"],
  default: "public",
  index: true
},

contentFormat: {
  type: String,
  enum: ["essay", "reel", "carousel", "paper", "note", "video", "archive"],
  default: "essay"
},

difficulty: {
  type: String,
  enum: ["beginner", "intermediate", "advanced"],
  default: "beginner"
},

estimatedMinutes: {
  type: Number,
  default: 3
}
};
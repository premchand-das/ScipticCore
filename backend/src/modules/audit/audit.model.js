import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    },

    action: {
      type: String,
      required: true,
      index: true
    },

    entity: {
      type: String,
      required: true,
      index: true
    },

    entityId: {
      type: String
    },

    metadata: {
      type: Object,
      default: {}
    },

    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);

export const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditSchema);
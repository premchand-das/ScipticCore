import { AuditLog } from "./audit.model.js";

export const createAuditLog = async ({
  admin,
  action,
  entity,
  entityId,
  metadata = {},
  ipAddress,
  userAgent
}) => {
  return AuditLog.create({
    admin,
    action,
    entity,
    entityId,
    metadata,
    ipAddress,
    userAgent
  });
};

export const getAuditLogs = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 30;
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.action) filter.action = query.action;
  if (query.entity) filter.entity = query.entity;
  if (query.admin) filter.admin = query.admin;

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("admin", "name email role")
      .lean(),

    AuditLog.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
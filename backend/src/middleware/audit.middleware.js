import { createAuditLog } from "../modules/audit/audit.service.js";

export const auditAction = (action, entity) => {
  return async (req, res, next) => {
    const originalJson = res.json;

    res.json = async function (body) {
      try {
        if (req.admin && body?.success !== false) {
          const entityId =
            body?.data?._id ||
            body?.data?.item?._id ||
            body?.data?.admin?._id ||
            req.params.id;

          await createAuditLog({
            admin: req.admin._id,
            action,
            entity,
            entityId,
            metadata: {
              params: req.params,
              body: req.body
            },
            ipAddress: req.ip,
            userAgent: req.get("user-agent")
          });
        }
      } catch (error) {
        console.error("Audit log failed:", error.message);
      }

      return originalJson.call(this, body);
    };

    next();
  };
};
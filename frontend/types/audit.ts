export interface AuditAdmin {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
}

export interface AuditLog {
  _id: string;
  admin?: AuditAdmin;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditResponse {
  items: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
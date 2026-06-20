"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { fetchAuditLogs } from "@/services/audit.service";
import type { AuditLog } from "@/types/audit";
import { AdminProtectedRoute } from "@/components/admin/admin-protected-route";

export default function AdminAuditPage() {
  return (
    <AdminProtectedRoute>
      <AuditContent />
    </AdminProtectedRoute>
  );
}

function AuditContent() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAuditLogs({ limit: 50 });
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f3ea] p-8 text-[#191713]">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-black/40">
          Security
        </p>
        <h1 className="mt-2 text-4xl font-semibold">Audit Logs</h1>
        <p className="mt-2 text-sm text-black/50">
          Super admin only activity history.
        </p>
      </div>

      <section className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-sm text-black/50">Loading audit logs...</p>
        ) : (
          <div className="divide-y divide-black/10">
            {items.map((log) => (
              <article key={log._id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-black p-3 text-white">
                    <ShieldCheck size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                        {log.action}
                      </span>
                      <span className="rounded-full bg-black/5 px-3 py-1 text-xs">
                        {log.entity}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-black/70">
                      {log.admin?.name || "Unknown admin"}{" "}
                      <span className="text-black/35">
                        {log.admin?.email}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>

                    {log.entityId && (
                      <p className="mt-3 break-all rounded-2xl bg-black/[0.03] p-3 text-xs text-black/50">
                        Entity ID: {log.entityId}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
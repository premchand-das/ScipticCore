"use client";

import { useEffect, useState } from "react";
import { Mail, RefreshCw } from "lucide-react";
import { fetchNewsletterSubscribers } from "@/services/newsletter.service";
import type { NewsletterSubscriber } from "@/types/newsletter";
import { AdminProtectedRoute } from "@/components/admin/admin-protected-route";

export default function AdminNewsletterPage() {
  return (
    <AdminProtectedRoute>
      <NewsletterContent />
    </AdminProtectedRoute>
  );
}

function NewsletterContent() {
  const [items, setItems] = useState<NewsletterSubscriber[]>([]);
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchNewsletterSubscribers({ status, limit: 50 });
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  return (
    <main className="min-h-screen bg-[#f7f3ea] p-8 text-[#191713]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-black/40">
            Audience
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Newsletter Admin</h1>
        </div>

        <button
          onClick={load}
          className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm text-white"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Card label="Total Subscribers" value={items.length} />
        <Card
          label="Active"
          value={items.filter((x) => x.isSubscribed).length}
        />
        <Card
          label="Inactive"
          value={items.filter((x) => !x.isSubscribed).length}
        />
      </section>

      <div className="mb-6 flex gap-3">
        {["all", "active", "inactive"].map((x) => (
          <button
            key={x}
            onClick={() => setStatus(x as typeof status)}
            className={`rounded-full px-5 py-2 text-sm capitalize ${
              status === x
                ? "bg-black text-white"
                : "bg-white text-black/60 ring-1 ring-black/10"
            }`}
          >
            {x}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-sm text-black/50">Loading subscribers...</p>
        ) : (
          <div className="divide-y divide-black/10">
            {items.map((sub) => (
              <div
                key={sub._id}
                className="grid gap-4 p-5 md:grid-cols-[1fr_160px_160px]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-black/5 p-3">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-medium">{sub.email}</p>
                    <p className="text-sm text-black/45">
                      {sub.name || "No name"} · {sub.source || "website"}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-black/50">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </p>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs ${
                    sub.isSubscribed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {sub.isSubscribed ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-6">
      <p className="text-sm text-black/45">{label}</p>
      <h2 className="mt-3 text-3xl font-semibold">{value}</h2>
    </div>
  );
}
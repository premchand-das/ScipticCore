"use client";

import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { fetchSitemap } from "@/services/seo.service";
import { AdminProtectedRoute } from "@/components/admin/admin-protected-route";

export default function AdminSeoPage() {
  return (
    <AdminProtectedRoute>
      <SeoContent />
    </AdminProtectedRoute>
  );
}

function SeoContent() {
  const [xml, setXml] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchSitemap();
      setXml(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f3ea] p-8 text-[#191713]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-black/40">
            Discovery
          </p>
          <h1 className="mt-2 text-4xl font-semibold">SEO Sitemap</h1>
        </div>

        <button
          onClick={load}
          className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm text-white"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <section className="rounded-[32px] border border-black/10 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Sitemap Preview</h2>
            <p className="text-sm text-black/45">
              Generated from confirmed backend SEO route.
            </p>
          </div>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/seo/sitemap`}
            target="_blank"
            className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm"
          >
            Open
            <ExternalLink size={14} />
          </a>
        </div>

        <pre className="max-h-[620px] overflow-auto rounded-[24px] bg-[#111] p-5 text-xs leading-relaxed text-white">
          {loading ? "Loading sitemap..." : xml}
        </pre>
      </section>
    </main>
  );
}
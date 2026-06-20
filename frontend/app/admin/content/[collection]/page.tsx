"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import {
  Archive,
  FileText,
  Flame,
  Newspaper,
  Plus,
  ScrollText,
  Search,
} from "lucide-react";

import { AdminProtectedRoute } from "@/components/admin/admin-protected-route";
import {
  deleteAdminContent,
  getAdminContentList,
  publishAdminContent,
  unpublishAdminContent,
} from "@/services/admin-content.service";
import type {
  AdminContentCollection,
  AdminContentItem,
  AdminContentListResponse,
} from "@/types/content";

const collections: Record<
  AdminContentCollection,
  {
    label: string;
    icon: typeof FileText;
    description: string;
  }
> = {
  episodes: {
    label: "Episodes",
    icon: ScrollText,
    description: "Manage documentary episodes and transcripts.",
  },
  series: {
  label: "Series",
  icon: BookOpen,
  description:
    "Manage documentary series, seasons, and intellectual journeys.",
},
  articles: {
    label: "Articles",
    icon: Newspaper,
    description: "Manage editorial essays and long-form pieces.",
  },
  papers: {
    label: "Papers",
    icon: FileText,
    description: "Manage research references and paper summaries.",
  },
  archive: {
    label: "Archive",
    icon: Archive,
    description: "Manage preserved references and external archives.",
  },
  dogmas: {
    label: "Dogmas",
    icon: Flame,
    description: "Manage critical claim analysis and dogma entries.",
  },
};

export default function AdminCollectionPage() {
  return (
    <AdminProtectedRoute>
      <AdminCollectionContent />
    </AdminProtectedRoute>
  );
}

function AdminCollectionContent() {
  const params = useParams();
  const collection = params.collection as AdminContentCollection;

  const config = collections[collection];

  const [data, setData] = useState<AdminContentListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const Icon = config?.icon || FileText;

  const canRender = useMemo(() => {
    return Boolean(config);
  }, [config]);

  async function loadContent() {
    if (!config) return;

    try {
      setLoading(true);

      const result = await getAdminContentList(collection, {
        page: 1,
        limit: 20,
        status: status || undefined,
        search: search || undefined,
      });

      setData(result);
      setError("");
    } catch {
      setError("Unable to load content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, status]);

  async function handlePublish(item: AdminContentItem) {
    if (item.status === "published") {
      await unpublishAdminContent(collection, item._id);
    } else {
      await publishAdminContent(collection, item._id);
    }

    loadContent();
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Delete this item permanently?");
    if (!ok) return;

    await deleteAdminContent(collection, id);
    loadContent();
  }

  if (!canRender) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] p-8">
        <div className="rounded-[32px] border border-[#E7E0D5] bg-white p-8">
          <h1 className="text-2xl font-semibold">Unknown collection</h1>
          <p className="mt-2 text-sm text-neutral-500">
            This admin collection is not configured yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F3EC] p-5 text-[#14110F] md:p-8 xl:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[36px] border border-[#E7E0D5] bg-white/80 p-7 shadow-sm md:p-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14110F] text-white">
                  <Icon size={20} />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
                  Content Studio
                </p>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
                {config.label}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
                {config.description}
              </p>
            </div>

            <Link
              href={`/admin/content/${collection}/new`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#14110F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              <Plus size={16} />
              New {config.label.slice(0, -1)}
            </Link>
          </div>
        </header>

        <section className="mt-6 rounded-[30px] border border-[#E7E0D5] bg-white/75 p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <div className="flex items-center gap-2 rounded-2xl border border-[#E7E0D5] bg-[#FBF8F2] px-4">
              <Search size={16} className="text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, summary, tags..."
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-12 rounded-2xl border border-[#E7E0D5] bg-[#FBF8F2] px-4 text-sm outline-none"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <button
              onClick={loadContent}
              className="h-12 rounded-2xl border border-[#14110F] px-5 text-sm font-semibold"
            >
              Search
            </button>
          </div>
        </section>

        {loading && (
          <div className="mt-6 rounded-[30px] border border-[#E7E0D5] bg-white/75 p-8 text-sm text-neutral-500">
            Loading content...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-[30px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
            {error}
          </div>
        )}

        {data && (
          <section className="mt-6 overflow-hidden rounded-[34px] border border-[#E7E0D5] bg-white/80 shadow-sm">
            <div className="border-b border-[#E7E0D5] p-6">
              <p className="text-sm text-neutral-500">
                {data.pagination.total} total items
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E7E0D5] bg-[#FBF8F2] text-xs uppercase tracking-[0.18em] text-neutral-500">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {data.items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-neutral-500"
                      >
                        No content found.
                      </td>
                    </tr>
                  ) : (
                    data.items.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-[#E7E0D5]/70 last:border-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold">{item.title}</p>
                          <p className="mt-1 text-xs text-neutral-500">
                            /{item.slug}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-neutral-600">
                          {item.category || "—"}
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-[#F1E9DC] px-3 py-1 text-xs font-semibold capitalize">
                            {item.status || "draft"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          {item.isFeatured ? "Yes" : "No"}
                        </td>

                        <td className="px-6 py-5 text-neutral-500">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/content/${collection}/edit/${item._id}`}
                              className="rounded-xl border border-[#E7E0D5] px-3 py-2 text-xs font-semibold hover:bg-[#F7F3EC]"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handlePublish(item)}
                              className="rounded-xl border border-[#E7E0D5] px-3 py-2 text-xs font-semibold hover:bg-[#F7F3EC]"
                            >
                              {item.status === "published"
                                ? "Unpublish"
                                : "Publish"}
                            </button>

                            <button
                              onClick={() => handleDelete(item._id)}
                              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
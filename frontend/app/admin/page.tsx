"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  BookOpen,
  FileText,
  Flame,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Plus,
  ScrollText,
  Sparkles,
  ImageIcon,
  SearchCheck,
  ShieldCheck,
  X,
} from "lucide-react";

import { AdminProtectedRoute } from "@/components/admin/admin-protected-route";
import { useAdminAuthStore } from "@/store/admin-auth-store";
import { getDashboardOverview } from "@/services/dashboard.service";
import type { DashboardOverview, ContentCollection } from "@/types/dashboard";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Series", href: "/admin/content/series", icon: BookOpen },
  { label: "Episodes", href: "/admin/content/episodes", icon: ScrollText },
  { label: "Articles", href: "/admin/content/articles", icon: Newspaper },
  { label: "Papers", href: "/admin/content/papers", icon: FileText },
  { label: "Archive", href: "/admin/content/archive", icon: Archive },
  { label: "Dogmas", href: "/admin/content/dogmas", icon: Flame },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "SEO Sitemap", href: "/admin/seo", icon: SearchCheck },
  { label: "Audit Logs", href: "/admin/audit", icon: ShieldCheck },
];

const quickActions = [
  { label: "New Series", href: "/admin/content/series/new", icon: Plus },
  { label: "New Episode", href: "/admin/content/episodes/new", icon: Plus },
  { label: "New Article", href: "/admin/content/articles/new", icon: Plus },
  { label: "New Paper", href: "/admin/content/papers/new", icon: Plus },
  { label: "New Archive", href: "/admin/content/archive/new", icon: Plus },
  { label: "New Dogma", href: "/admin/content/dogmas/new", icon: Plus },
];

const collectionLabels: Record<ContentCollection, string> = {
  series: "Series",
  episodes: "Episodes",
  articles: "Articles",
  papers: "Papers",
  archive: "Archive",
  dogmas: "Dogmas",
};

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  );
}

function AdminDashboard() {
  const { admin, logout } = useAdminAuthStore();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        const data = await getDashboardOverview();

        if (mounted) {
          setOverview(data);
          setError("");
        }
      } catch {
        if (mounted) {
          setError("Dashboard data could not be loaded.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const topCollection = useMemo(() => {
    if (!overview?.contentStats?.length) return null;
    return [...overview.contentStats].sort((a, b) => b.total - a.total)[0];
  }, [overview]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F3EC] text-[#14110F]">
      {/* mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-[#E7E0D5] bg-[#FBF8F2]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#14110F] text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">SkepticCore</p>
              <p className="text-xs text-neutral-500">Editorial Console</p>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7E0D5] bg-white"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 rounded-[26px] border border-[#E7E0D5] bg-white p-3 shadow-sm">
            <nav className="grid max-h-[65vh] gap-1 overflow-y-auto pr-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-[#F1E9DC] hover:text-neutral-950"
                  >
                    <Icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14110F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        {/* desktop sidebar */}
        <aside className="hidden border-r border-[#E7E0D5] bg-[#FBF8F2]/90 p-5 lg:block">
          <div className="sticky top-5">
            <div className="rounded-[28px] border border-[#E7E0D5] bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14110F] text-white">
                  <Sparkles size={19} />
                </div>
                <div>
                  <p className="text-sm font-semibold">SkepticCore</p>
                  <p className="text-xs text-neutral-500">Editorial Console</p>
                </div>
              </div>

              <nav className="mt-8 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-[#F1E9DC] hover:text-neutral-950"
                    >
                      <Icon size={17} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={logout}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14110F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <section className="min-w-0 p-4 sm:p-5 md:p-8 xl:p-10">
          <div className="mx-auto max-w-7xl">
            <header className="rounded-[28px] border border-[#E7E0D5] bg-white/75 p-5 shadow-sm sm:rounded-[36px] sm:p-7 md:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-neutral-500 sm:text-xs sm:tracking-[0.32em]">
                Admin Dashboard
              </p>

              <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-6xl">
                    Editorial control room.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
                    Welcome back, {admin?.name || "Admin"}. Monitor publishing,
                    drafts, subscribers, and recent knowledge assets.
                  </p>
                </div>

                {topCollection && (
                  <div className="w-full rounded-[24px] border border-[#E7E0D5] bg-[#F7F3EC] p-5 sm:w-fit sm:rounded-[28px]">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 sm:text-xs">
                      Largest Collection
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {collectionLabels[topCollection.name]}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {topCollection.total} total items
                    </p>
                  </div>
                )}
              </div>
            </header>

            {loading && (
              <div className="mt-6 rounded-[26px] border border-[#E7E0D5] bg-white/70 p-6 text-sm text-neutral-500 sm:mt-8 sm:rounded-[32px] sm:p-8">
                Loading dashboard overview...
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-[26px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 sm:mt-8 sm:rounded-[32px] sm:p-8">
                {error}
              </div>
            )}

            {overview && (
              <>
                <section className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="Total Content" value={overview.totals.content} />
                  <MetricCard label="Published" value={overview.totals.published} />
                  <MetricCard label="Drafts" value={overview.totals.drafts} />
                  <MetricCard label="Subscribers" value={overview.totals.subscribers} />
                </section>

                <section className="mt-6 grid gap-6 sm:mt-8 xl:grid-cols-[1.3fr_0.7fr] xl:gap-8">
                  <div className="min-w-0 rounded-[28px] border border-[#E7E0D5] bg-white/80 p-5 shadow-sm sm:rounded-[34px] sm:p-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500 sm:text-xs sm:tracking-[0.24em]">
                        Content Statistics
                      </p>
                      <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                        Publishing overview
                      </h2>
                    </div>

                    {/* desktop/tablet table */}
                    <div className="mt-6 hidden overflow-x-auto md:block">
                      <table className="w-full min-w-[720px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-[#E7E0D5] text-xs uppercase tracking-[0.18em] text-neutral-500">
                            <th className="py-4">Collection</th>
                            <th className="py-4">Total</th>
                            <th className="py-4">Published</th>
                            <th className="py-4">Drafts</th>
                            <th className="py-4">Featured</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overview.contentStats.map((stat) => (
                            <tr
                              key={stat.name}
                              className="border-b border-[#E7E0D5]/70 last:border-0"
                            >
                              <td className="py-4 font-semibold">
                                {collectionLabels[stat.name]}
                              </td>
                              <td className="py-4">{stat.total}</td>
                              <td className="py-4">{stat.published}</td>
                              <td className="py-4">{stat.drafts}</td>
                              <td className="py-4">{stat.featured}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* mobile cards */}
                    <div className="mt-5 grid gap-3 md:hidden">
                      {overview.contentStats.map((stat) => (
                        <div
                          key={stat.name}
                          className="rounded-3xl border border-[#E7E0D5] bg-[#FBF8F2] p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold">
                              {collectionLabels[stat.name]}
                            </p>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-700">
                              {stat.total} total
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="rounded-2xl bg-white p-3">
                              <p className="text-neutral-500">Published</p>
                              <p className="mt-1 text-lg font-semibold">
                                {stat.published}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-white p-3">
                              <p className="text-neutral-500">Drafts</p>
                              <p className="mt-1 text-lg font-semibold">
                                {stat.drafts}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-white p-3">
                              <p className="text-neutral-500">Featured</p>
                              <p className="mt-1 text-lg font-semibold">
                                {stat.featured}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#E7E0D5] bg-[#14110F] p-5 text-white shadow-sm sm:rounded-[34px] sm:p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 sm:text-xs sm:tracking-[0.24em]">
                      Quick Actions
                    </p>
                    <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                      Create new work
                    </h2>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                          <Link
                            key={action.href}
                            href={action.href}
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
                          >
                            {action.label}
                            <Icon size={16} />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <section className="mt-6 rounded-[28px] border border-[#E7E0D5] bg-white/80 p-5 shadow-sm sm:mt-8 sm:rounded-[34px] sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500 sm:text-xs sm:tracking-[0.24em]">
                    Recent Content
                  </p>
                  <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                    Latest editorial activity
                  </h2>

                  <div className="mt-6 grid gap-3">
                    {overview.recentContent.length === 0 ? (
                      <p className="rounded-2xl bg-[#F7F3EC] p-5 text-sm text-neutral-500">
                        No recent content yet.
                      </p>
                    ) : (
                      overview.recentContent.map((item) => (
                        <Link
                          key={`${item.collection}-${item._id}`}
                          href={`/admin/content/${item.collection}/edit/${item._id}`}
                          className="grid gap-3 rounded-3xl border border-[#E7E0D5] bg-[#FBF8F2] p-4 transition hover:bg-[#F3ECE0] md:grid-cols-[1fr_auto_auto] md:items-center"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{item.title}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
                              {collectionLabels[item.collection]}
                            </p>
                          </div>

                          <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-neutral-700">
                            {item.status}
                          </span>

                          <span className="text-sm text-neutral-500">
                            {formatDate(item.createdAt)}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[26px] border border-[#E7E0D5] bg-white/80 p-5 shadow-sm sm:rounded-[30px] sm:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.22em]">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl">
        {value}
      </p>
    </div>
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
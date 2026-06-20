import { SiteNavbar } from "@/components/site/site-navbar";
import { SiteFooter } from "@/components/site/site-footer";
import { ContentCard } from "@/components/content/content-card";
import { getContentList } from "@/services/content.service";

export default async function SeriesPage() {
  const items = await getContentList("series").catch(() => []);

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-neutral-950">
      <SiteNavbar />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
          SkepticCore Library
        </p>

        <h1 className="mt-5 text-6xl font-semibold tracking-[-0.05em]">
          Series
        </h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ContentCard key={item._id} item={item} type="series" />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
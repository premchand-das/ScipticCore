import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ContentItem, ContentType } from "@/types/content";

export function ContentDetailPage({
  item,
  type,
}: {
  item: ContentItem;
  type: ContentType;
}) {
  const imageUrl = item.thumbnail || item.seo?.ogImage;

  return (
    <main className="min-h-screen bg-[#050505] text-[#F4EAD8]">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <Link
          href={`/${type}`}
          className="mb-10 inline-flex items-center gap-2 text-sm text-[#C9BFAE]/60 hover:text-[#C7A15A]"
        >
          <ArrowLeft size={16} />
          Back to {type}
        </Link>

        <p className="text-xs uppercase tracking-[0.35em] text-[#C7A15A]">
          {item.category || type}
        </p>

        <h1 className="serif mt-6 text-5xl leading-[0.95] tracking-[-0.05em] md:text-7xl">
          {item.title}
        </h1>

        {item.hook && (
          <p className="mt-8 max-w-3xl text-xl leading-9 text-[#C9BFAE]/75">
            {item.hook}
          </p>
        )}

        {imageUrl && (
          <img
            src={imageUrl}
            alt={item.title}
            className="mt-12 aspect-[16/9] w-full rounded-[32px] object-cover"
          />
        )}

        {item.summary && (
          <div className="mt-12 rounded-[28px] border border-[#F4EAD8]/10 bg-[#F4EAD8]/[0.03] p-6 text-[#C9BFAE]/80">
            {item.summary}
          </div>
        )}

        {item.body && (
          <article className="prose prose-invert prose-lg mt-12 max-w-none prose-p:leading-9 prose-p:text-[#C9BFAE]/80">
            {item.body.split("\n").map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </article>
        )}

        {item.sources && item.sources.length > 0 && (
          <section className="mt-16 border-t border-[#F4EAD8]/10 pt-10">
            <h2 className="text-sm uppercase tracking-[0.3em] text-[#C7A15A]">
              Sources
            </h2>

            <div className="mt-6 space-y-4">
              {item.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-[#F4EAD8]/10 bg-[#F4EAD8]/[0.03] p-5 hover:border-[#C7A15A]/40"
                >
                  <p className="font-medium">{source.title || "Source"}</p>
                  <p className="mt-1 text-sm text-[#C9BFAE]/50">
                    {[source.author, source.publisher].filter(Boolean).join(" · ")}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
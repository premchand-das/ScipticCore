import Link from "next/link";
import type { ContentItem, ContentType } from "@/types/content";

export function ContentCard({
  item,
  type,
}: {
  item: ContentItem;
  type: ContentType;
}) {
  const imageUrl =
    item.coverImage ||
    item.imageUrl ||
    item.image ||
    item.thumbnail ||
    item.seo?.ogImage;

    const href = `/${type}/${item.slug || item._id}`;

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-[32px] border border-black/10 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[4/3] bg-neutral-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            SkepticCore
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
          {type}
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
          {item.title}
        </h3>

        {item.summary && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
            {item.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
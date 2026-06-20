import { Series } from "../series/series.model.js";
import { Episode } from "../episodes/episode.model.js";
import { Article } from "../articles/article.model.js";
import { Paper } from "../papers/paper.model.js";
import { Archive } from "../archive/archive.model.js";
import { Dogma } from "../dogmas/dogma.model.js";

const collections = [
  { name: "series", path: "/series", Model: Series },
  { name: "episodes", path: "/episodes", Model: Episode },
  { name: "articles", path: "/articles", Model: Article },
  { name: "papers", path: "/papers", Model: Paper },
  { name: "archive", path: "/archive", Model: Archive },
  { name: "dogmas", path: "/dogmas", Model: Dogma }
];

export const getSitemapEntries = async () => {
  const groups = await Promise.all(
    collections.map(async ({ name, path, Model }) => {
      const items = await Model.find({
        status: "published",
        visibility: { $ne: "private" }
      })
        .select("title slug updatedAt publishedAt seo")
        .sort({ publishedAt: -1 })
        .lean();

      return items.map((item) => ({
        collection: name,
        title: item.title,
        slug: item.slug,
        path: `${path}/${item.slug}`,
        lastModified: item.updatedAt,
        publishedAt: item.publishedAt,
        canonicalUrl: item.seo?.canonicalUrl || null
      }));
    })
  );

  return groups.flat();
};
import { Series } from "../series/series.model.js";
import { Episode } from "../episodes/episode.model.js";
import { Article } from "../articles/article.model.js";
import { Paper } from "../papers/paper.model.js";
import { Archive } from "../archive/archive.model.js";
import { Dogma } from "../dogmas/dogma.model.js";

const searchableModels = [
  { collection: "series", Model: Series },
  { collection: "episodes", Model: Episode },
  { collection: "articles", Model: Article },
  { collection: "papers", Model: Paper },
  { collection: "archive", Model: Archive },
  { collection: "dogmas", Model: Dogma }
];

const mapSearchItem = (item, collection) => ({
  _id: item._id,
  title: item.title,
  slug: item.slug,
  type: item.type,
  category: item.category,
  hook: item.hook,
  summary: item.summary,
  thumbnail: item.thumbnail,
  tags: item.tags,
  status: item.status,
  publishedAt: item.publishedAt,
  createdAt: item.createdAt,
  collection
});

export const globalSearch = async ({ query, publicOnly = true }) => {
  const searchText = query.q || query.search;

  if (!searchText || searchText.trim().length < 2) {
    return {
      query: searchText || "",
      results: []
    };
  }

  const limit = Number(query.limit) || 8;

  const results = await Promise.all(
    searchableModels.map(async ({ collection, Model }) => {
      const filter = {
        $text: { $search: searchText }
      };

    if (publicOnly) {
  filter.status = "published";
  filter.visibility = { $in: ["public", undefined] };
}

      const items = await Model.find(filter, {
        score: { $meta: "textScore" }
      })
        .sort({ score: { $meta: "textScore" }, publishedAt: -1 })
        .limit(limit)
        .lean();

      return items.map((item) => ({
        ...mapSearchItem(item, collection),
        score: item.score
      }));
    })
  );

  return {
    query: searchText,
    results: results.flat()
  };
};
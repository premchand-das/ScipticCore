import { Series } from "../series/series.model.js";
import { Episode } from "../episodes/episode.model.js";
import { Article } from "../articles/article.model.js";
import { Paper } from "../papers/paper.model.js";
import { Archive } from "../archive/archive.model.js";
import { Dogma } from "../dogmas/dogma.model.js";

const publicFilter = {
  status: "published",
  visibility: { $in: ["public", undefined] }
};

const mapItem = (item, collection) => ({
  _id: item._id,
  title: item.title,
  slug: item.slug,
  type: item.type,
  category: item.category,
  hook: item.hook,
  summary: item.summary,
  thumbnail: item.thumbnail,
  tags: item.tags,
  readingTime: item.readingTime,
  publishedAt: item.publishedAt,
  isFeatured: item.isFeatured,
  order: item.order,
  collection
});

export const getHomeDiscovery = async () => {
  const [
    featuredSeries,
    featuredEpisodes,
    latestArticles,
    latestPapers,
    latestDogmas,
    latestArchive
  ] = await Promise.all([
    Series.find({ ...publicFilter, isFeatured: true })
      .sort({ order: 1, publishedAt: -1 })
      .limit(6)
      .lean(),

    Episode.find({ ...publicFilter, isFeatured: true })
      .sort({ order: 1, publishedAt: -1 })
      .limit(8)
      .populate("series", "title slug")
      .lean(),

    Article.find(publicFilter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(6)
      .lean(),

    Paper.find(publicFilter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(6)
      .lean(),

    Dogma.find(publicFilter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(6)
      .lean(),

    Archive.find(publicFilter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(8)
      .lean()
  ]);

  return {
    featuredSeries: featuredSeries.map((item) => mapItem(item, "series")),
    featuredEpisodes: featuredEpisodes.map((item) => ({
      ...mapItem(item, "episodes"),
      series: item.series
    })),
    latestArticles: latestArticles.map((item) => mapItem(item, "articles")),
    latestPapers: latestPapers.map((item) => mapItem(item, "papers")),
    latestDogmas: latestDogmas.map((item) => mapItem(item, "dogmas")),
    latestArchive: latestArchive.map((item) => mapItem(item, "archive"))
  };
};
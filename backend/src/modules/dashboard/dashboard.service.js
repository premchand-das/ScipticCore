import { Series } from "../series/series.model.js";
import { Episode } from "../episodes/episode.model.js";
import { Article } from "../articles/article.model.js";
import { Paper } from "../papers/paper.model.js";
import { Archive } from "../archive/archive.model.js";
import { Dogma } from "../dogmas/dogma.model.js";
import { NewsletterSubscriber } from "../newsletter/newsletter.model.js";

const models = [
  { name: "series", Model: Series },
  { name: "episodes", Model: Episode },
  { name: "articles", Model: Article },
  { name: "papers", Model: Paper },
  { name: "archive", Model: Archive },
  { name: "dogmas", Model: Dogma }
];

export const getAdminDashboardOverview = async () => {
  const contentStats = await Promise.all(
    models.map(async ({ name, Model }) => {
      const [total, published, drafts, featured] = await Promise.all([
        Model.countDocuments(),
        Model.countDocuments({ status: "published" }),
        Model.countDocuments({ status: "draft" }),
        Model.countDocuments({ isFeatured: true })
      ]);

      return {
        name,
        total,
        published,
        drafts,
        featured
      };
    })
  );

  const subscribers = await NewsletterSubscriber.countDocuments({
    isSubscribed: true
  });

  const recentContentGroups = await Promise.all(
    models.map(async ({ name, Model }) => {
      const items = await Model.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title slug status category thumbnail createdAt publishedAt")
        .lean();

      return items.map((item) => ({
        ...item,
        collection: name
      }));
    })
  );

  const recentContent = recentContentGroups
    .flat()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 12);

  return {
    contentStats,
    totals: {
      content: contentStats.reduce((sum, item) => sum + item.total, 0),
      published: contentStats.reduce((sum, item) => sum + item.published, 0),
      drafts: contentStats.reduce((sum, item) => sum + item.drafts, 0),
      featured: contentStats.reduce((sum, item) => sum + item.featured, 0),
      subscribers
    },
    recentContent
  };
};
import api from "@/lib/api";

export type DiscoveryItem = {
  _id: string;
  title: string;
  slug?: string;
  type: string;
  category?: string;
  hook?: string;
  summary?: string;
  coverImage?: string;
  thumbnail?: string;
  status?: string;
  createdAt?: string;
};

export type DiscoveryHome = {
  featured: DiscoveryItem[];
  series: DiscoveryItem[];
  latest: DiscoveryItem[];
  articles: DiscoveryItem[];
  papers: DiscoveryItem[];
  dogmas: DiscoveryItem[];
};

function normalizeItem(item: any, type: string): DiscoveryItem {
  return {
    _id: item._id,
    title: item.title,
    slug: item.slug,
    type,
    category: item.category,
    hook: item.hook,
    summary: item.summary,
    coverImage: item.coverImage,
    thumbnail: item.thumbnail,
    status: item.status,
    createdAt: item.createdAt,
  };
}

async function getList(type: string): Promise<DiscoveryItem[]> {
  const res = await api.get(`/${type}`);

  const raw =
    res.data?.data?.items ||
    res.data?.data ||
    res.data?.items ||
    [];

  return Array.isArray(raw)
    ? raw.map((item) => normalizeItem(item, type))
    : [];
}

export const discoveryService = {
  async home(): Promise<DiscoveryHome> {
    const [series, episodes, articles, papers, dogmas] = await Promise.all([
      getList("series").catch(() => []),
      getList("episodes").catch(() => []),
      getList("articles").catch(() => []),
      getList("papers").catch(() => []),
      getList("dogmas").catch(() => []),
    ]);

    const latest = [
      ...episodes,
      ...articles,
      ...papers,
      ...dogmas,
    ].sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    return {
      featured: [...series, ...articles, ...papers].slice(0, 3),
      series,
      latest,
      articles,
      papers,
      dogmas,
    };
  },
};
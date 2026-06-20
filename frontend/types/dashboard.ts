export type ContentCollection =
  | "series"
  | "episodes"
  | "articles"
  | "papers"
  | "archive"
  | "dogmas";

export interface ContentStat {
  name: ContentCollection;
  total: number;
  published: number;
  drafts: number;
  featured: number;
}

export interface RecentContent {
  _id: string;
  title: string;
  slug: string;
  status: string;
  category?: string;
  thumbnail?: string;
  createdAt: string;
  publishedAt?: string;
  collection: ContentCollection;
}

export interface DashboardOverview {
  contentStats: ContentStat[];
  totals: {
    content: number;
    published: number;
    drafts: number;
    featured: number;
    subscribers: number;
  };
  recentContent: RecentContent[];
}
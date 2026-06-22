export type AdminContentCollection =
  | "series"
  | "episodes"
  | "articles"
  | "papers"
  | "archive"
  | "dogmas";

export type ContentStatus = "draft" | "published" | "archived";
export type ContentVisibility = "public" | "private" | "unlisted";

export type ContentFormat =
  | "essay"
  | "reel"
  | "carousel"
  | "paper"
  | "note"
  | "video"
  | "archive";

export type ContentDifficulty = "beginner" | "intermediate" | "advanced";

export type ContentSource = {
  title?: string;
  url?: string;
  link?: string;
  name?: string;
  author?: string;
  publisher?: string;
  publishedAt?: string;
};

export type ContentSeo = {
  title?: string;
  description?: string;
  ogImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
};

export type ContentItem = {
  _id: string;
  title: string;
  slug: string;

  hook?: string;
  summary?: string;
  body?: string;
  excerpt?: string;
  description?: string;

  tags?: string[];
  status?: ContentStatus | string;
  category?: string;
  type?: string;

  isFeatured?: boolean;
  visibility?: ContentVisibility;
  contentFormat?: ContentFormat;
  difficulty?: ContentDifficulty;

  coverImage?: string;
  imageUrl?: string;
  image?: string;
  thumbnail?: string;

  readingTime?: number;
  estimatedMinutes?: number;
  order?: number;

  seo?: ContentSeo;
  sources?: ContentSource[];

  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Content = ContentItem;

export type ContentType = AdminContentCollection;

export interface AdminContentItem extends ContentItem {}

export interface AdminContentPayload {
  title: string;
  slug?: string;
  type: string;
  category: string;

  hook?: string;
  summary?: string;
  body?: string;
  thumbnail?: string;

  tags?: string[];
  readingTime?: number;
  status?: ContentStatus;
  isFeatured?: boolean;
  order?: number;

  visibility?: ContentVisibility;
  contentFormat?: ContentFormat;
  difficulty?: ContentDifficulty;
  estimatedMinutes?: number;

  seo?: ContentSeo;
  sources?: ContentSource[];
}

export interface AdminContentListResponse {
  items: AdminContentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
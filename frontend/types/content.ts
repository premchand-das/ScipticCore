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

export type ContentItem = {
  _id: string;
  title: string;
  slug: string;
  hook?: string;
  summary?: string;
  body?: string;
  thumbnail?: string;
  tags?: string[];
  status?: string;
  category?: string;
  type?: string;
  isFeatured?: boolean;
  visibility?: ContentVisibility;
  contentFormat?: ContentFormat;
  difficulty?: ContentDifficulty;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

export type ContentType = AdminContentCollection;

export interface AdminContentItem extends ContentItem {
  readingTime?: number;
  estimatedMinutes?: number;
  order?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
  };
  sources?: {
    title?: string;
    url?: string;
    author?: string;
    publisher?: string;
    publishedAt?: string;
  }[];
}

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
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
  };
  sources?: {
    title?: string;
    url?: string;
    author?: string;
    publisher?: string;
    publishedAt?: string;
  }[];
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
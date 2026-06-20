export interface NewsletterSubscriber {
  _id: string;
  email: string;
  name?: string;
  source?: string;
  isSubscribed: boolean;
  subscribedAt?: string;
  unsubscribedAt?: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface NewsletterResponse {
  items: NewsletterSubscriber[];
  pagination: Pagination;
}
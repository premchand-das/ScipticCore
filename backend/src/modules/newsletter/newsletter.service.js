import { NewsletterSubscriber } from "./newsletter.model.js";

export const subscribeToNewsletter = async (payload) => {
  const existing = await NewsletterSubscriber.findOne({
    email: payload.email
  });

  if (existing) {
    existing.isSubscribed = true;
    existing.unsubscribedAt = undefined;
    existing.name = payload.name || existing.name;
    existing.source = payload.source || existing.source;

    await existing.save();

    return {
      subscriber: existing,
      alreadyExists: true
    };
  }

  const subscriber = await NewsletterSubscriber.create(payload);

  return {
    subscriber,
    alreadyExists: false
  };
};

export const getNewsletterSubscribers = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 30;
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.status === "active") filter.isSubscribed = true;
  if (query.status === "inactive") filter.isSubscribed = false;

  const [items, total] = await Promise.all([
    NewsletterSubscriber.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    NewsletterSubscriber.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
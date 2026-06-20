import { Series } from "./series.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateSlug } from "../../utils/generateSlug.js";

const buildQuery = (query) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.featured === "true") {
    filter.isFeatured = true;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  return filter;
};

export const createSeries = async (payload, adminId) => {
  const slug = payload.slug || generateSlug(payload.title);

  const existing = await Series.findOne({ slug });

  if (existing) {
    throw new ApiError(409, "Series with this slug already exists");
  }

  const series = await Series.create({
    ...payload,
    slug,
    createdBy: adminId,
    updatedBy: adminId
  });

  return series;
};

export const getPublicSeriesList = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = buildQuery({
    ...query,
    status: "published"
  });

  const [items, total] = await Promise.all([
    Series.find(filter)
      .sort({ isFeatured: -1, order: 1, publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Series.countDocuments(filter)
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

export const getAdminSeriesList = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = buildQuery(query);

  const [items, total] = await Promise.all([
    Series.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .lean(),
    Series.countDocuments(filter)
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

export const getSeriesBySlug = async (slug) => {
  const series = await Series.findOne({
    slug,
    status: "published"
  }).lean();

  if (!series) {
    throw new ApiError(404, "Series not found");
  }

  return series;
};

export const getSeriesById = async (id) => {
  const series = await Series.findById(id);

  if (!series) {
    throw new ApiError(404, "Series not found");
  }

  return series;
};

export const updateSeries = async (id, payload, adminId) => {
  const series = await getSeriesById(id);

  if (payload.slug) {
    const existing = await Series.findOne({
      slug: payload.slug,
      _id: { $ne: id }
    });

    if (existing) {
      throw new ApiError(409, "Slug already in use");
    }
  }

  Object.assign(series, {
    ...payload,
    updatedBy: adminId
  });

  await series.save();

  return series;
};

export const deleteSeries = async (id) => {
  const series = await getSeriesById(id);

  await series.deleteOne();

  return series;
};

export const publishSeries = async (id, adminId) => {
  const series = await getSeriesById(id);

  series.status = "published";
  series.publishedAt = series.publishedAt || new Date();
  series.updatedBy = adminId;

  await series.save();

  return series;
};

export const unpublishSeries = async (id, adminId) => {
  const series = await getSeriesById(id);

  series.status = "draft";
  series.updatedBy = adminId;

  await series.save();

  return series;
};
import { Episode } from "./episode.model.js";
import { Series } from "../series/series.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateSlug } from "../../utils/generateSlug.js";

const buildQuery = (query, publicOnly = false) => {
  const filter = {};

  if (publicOnly) {
    filter.status = "published";
  } else if (query.status) {
    filter.status = query.status;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.series) {
    filter.series = query.series;
  }

  if (query.featured === "true") {
    filter.isFeatured = true;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  return filter;
};

const ensureSeriesExists = async (seriesId) => {
  const series = await Series.findById(seriesId);

  if (!series) {
    throw new ApiError(404, "Series not found");
  }

  return series;
};

export const createEpisode = async (payload, adminId) => {
  await ensureSeriesExists(payload.series);

  const slug = payload.slug || generateSlug(payload.title);

  const existingSlug = await Episode.findOne({ slug });

  if (existingSlug) {
    throw new ApiError(409, "Episode with this slug already exists");
  }

  const existingEpisodeNumber = await Episode.findOne({
    series: payload.series,
    episodeNumber: payload.episodeNumber
  });

  if (existingEpisodeNumber) {
    throw new ApiError(409, "Episode number already exists in this series");
  }

  const episode = await Episode.create({
    ...payload,
    slug,
    createdBy: adminId,
    updatedBy: adminId
  });

  await Series.findByIdAndUpdate(payload.series, {
    $inc: { totalEpisodes: 1 }
  });

  return episode.populate("series", "title slug season");
};

export const getPublicEpisodesList = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = buildQuery(query, true);

  const [items, total] = await Promise.all([
    Episode.find(filter)
      .sort({
        isFeatured: -1,
        order: 1,
        episodeNumber: 1,
        publishedAt: -1,
        createdAt: -1
      })
      .skip(skip)
      .limit(limit)
      .populate("series", "title slug season")
      .lean(),

    Episode.countDocuments(filter)
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

export const getAdminEpisodesList = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = buildQuery(query, false);

  const [items, total] = await Promise.all([
    Episode.find(filter)
      .sort({ series: 1, episodeNumber: 1, order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("series", "title slug season")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .lean(),

    Episode.countDocuments(filter)
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

export const getEpisodeBySlug = async (slug) => {
  const episode = await Episode.findOne({
    slug,
    status: "published"
  })
    .populate("series", "title slug season")
    .lean();

  if (!episode) {
    throw new ApiError(404, "Episode not found");
  }

  return episode;
};

export const getEpisodeById = async (id) => {
  const episode = await Episode.findById(id);

  if (!episode) {
    throw new ApiError(404, "Episode not found");
  }

  return episode;
};

export const updateEpisode = async (id, payload, adminId) => {
  const episode = await getEpisodeById(id);

  if (payload.series) {
    await ensureSeriesExists(payload.series);
  }

  if (payload.slug) {
    const existingSlug = await Episode.findOne({
      slug: payload.slug,
      _id: { $ne: id }
    });

    if (existingSlug) {
      throw new ApiError(409, "Slug already in use");
    }
  }

  if (payload.episodeNumber || payload.series) {
    const nextSeries = payload.series || episode.series;
    const nextEpisodeNumber = payload.episodeNumber || episode.episodeNumber;

    const existingEpisodeNumber = await Episode.findOne({
      series: nextSeries,
      episodeNumber: nextEpisodeNumber,
      _id: { $ne: id }
    });

    if (existingEpisodeNumber) {
      throw new ApiError(409, "Episode number already exists in this series");
    }
  }

  Object.assign(episode, {
    ...payload,
    updatedBy: adminId
  });

  await episode.save();

  return episode.populate("series", "title slug season");
};

export const deleteEpisode = async (id) => {
  const episode = await getEpisodeById(id);
  const seriesId = episode.series;

  await episode.deleteOne();

  await Series.findByIdAndUpdate(seriesId, {
    $inc: { totalEpisodes: -1 }
  });

  return episode;
};

export const publishEpisode = async (id, adminId) => {
  const episode = await getEpisodeById(id);

  episode.status = "published";
  episode.publishedAt = episode.publishedAt || new Date();
  episode.updatedBy = adminId;

  await episode.save();

  return episode.populate("series", "title slug season");
};

export const unpublishEpisode = async (id, adminId) => {
  const episode = await getEpisodeById(id);

  episode.status = "draft";
  episode.updatedBy = adminId;

  await episode.save();

  return episode.populate("series", "title slug season");
};
import mongoose from "mongoose";
import { ApiError } from "../../utils/ApiError.js";
import { generateSlug } from "../../utils/generateSlug.js";
import { normalizeSlug } from "../../utils/normalizeSlug.js";

export const createContentService = (Model, entityName = "Content") => {
  const buildQuery = (query, publicOnly = false) => {
    const filter = {};

   if (publicOnly) {
  filter.status = "published";
  filter.visibility = { $in: ["public", undefined] };

    } else if (query.status) {
      filter.status = query.status;
    }

    if (query.category) filter.category = query.category;
    if (query.type) filter.type = query.type;
    if (query.featured === "true") filter.isFeatured = true;

    if (query.tag) {
      filter.tags = { $in: [query.tag] };
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    return filter;
  };

  const create = async (payload, adminId) => {
    const slug = normalizeSlug({
  title: payload.title,
  slug: payload.slug
});

    const existing = await Model.findOne({ slug });

    if (existing) {
      throw new ApiError(409, `${entityName} with this slug already exists`);
    }

    return Model.create({
      ...payload,
      slug,
      createdBy: adminId,
      updatedBy: adminId
    });
  };

  const getPublicList = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = buildQuery(query, true);

    const [items, total] = await Promise.all([
      Model.find(filter)
        .sort({ isFeatured: -1, order: 1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Model.countDocuments(filter)
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

  const getAdminList = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = buildQuery(query, false);

    const [items, total] = await Promise.all([
      Model.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .lean(),
      Model.countDocuments(filter)
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

  const getBySlug = async (slug) => {
    const item = await Model.findOne({
      slug,
      status: "published"
    }).lean();

    if (!item) {
      throw new ApiError(404, `${entityName} not found`);
    }

    return item;
  };

  const getById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${entityName} ID`);
  }

  const item = await Model.findById(id)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!item) {
    throw new ApiError(404, `${entityName} not found`);
  }

  return item;
};

  const update = async (id, payload, adminId) => {
    const item = await getById(id);

    if (payload.slug) {
      const existing = await Model.findOne({
        slug: payload.slug,
        _id: { $ne: id }
      });

      if (existing) {
        throw new ApiError(409, "Slug already in use");
      }
    }

    Object.assign(item, {
      ...payload,
      updatedBy: adminId
    });

    await item.save();

    return item;
  };

  const remove = async (id) => {
    const item = await getById(id);
    await item.deleteOne();
    return item;
  };

  const publish = async (id, adminId) => {
    const item = await getById(id);

    item.status = "published";
    item.publishedAt = item.publishedAt || new Date();
    item.updatedBy = adminId;

    await item.save();

    return item;
  };

  const unpublish = async (id, adminId) => {
    const item = await getById(id);

    item.status = "draft";
    item.updatedBy = adminId;

    await item.save();

    return item;
  };

  

return {
  create,
  getPublicList,
  getAdminList,
  getBySlug,
  getById,
  update,
  remove,
  publish,
  unpublish
};
};
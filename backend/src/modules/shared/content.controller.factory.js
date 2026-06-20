import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createContentController = (service, entityName = "Content") => ({
  create: asyncHandler(async (req, res) => {
    const item = await service.create(req.validated.body, req.admin._id);

    res.status(201).json(new ApiResponse(201, `${entityName} created`, item));
  }),

  getPublicList: asyncHandler(async (req, res) => {
    const result = await service.getPublicList(req.query);

    res.status(200).json(new ApiResponse(200, `${entityName} fetched`, result));
  }),

  getAdminList: asyncHandler(async (req, res) => {
    const result = await service.getAdminList(req.query);

    res
      .status(200)
      .json(new ApiResponse(200, `Admin ${entityName} fetched`, result));
  }),

  getBySlug: asyncHandler(async (req, res) => {
    const item = await service.getBySlug(req.params.slug);

    res.status(200).json(new ApiResponse(200, `${entityName} fetched`, item));
  }),

  update: asyncHandler(async (req, res) => {
    const item = await service.update(
      req.params.id,
      req.validated.body,
      req.admin._id
    );

    res.status(200).json(new ApiResponse(200, `${entityName} updated`, item));
  }),

  remove: asyncHandler(async (req, res) => {
    await service.remove(req.params.id);

    res.status(200).json(new ApiResponse(200, `${entityName} deleted`));
  }),

  publish: asyncHandler(async (req, res) => {
    const item = await service.publish(req.params.id, req.admin._id);

    res.status(200).json(new ApiResponse(200, `${entityName} published`, item));
  }),

  getAdminById: asyncHandler(async (req, res) => {
  const item = await service.getById(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,
      `${entityName} fetched`,
      item
    )
  );
}),

  unpublish: asyncHandler(async (req, res) => {
    const item = await service.unpublish(req.params.id, req.admin._id);

    res
      .status(200)
      .json(new ApiResponse(200, `${entityName} unpublished`, item));
  })
});


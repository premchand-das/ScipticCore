import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  getNewsletterSubscribers,
  subscribeToNewsletter
} from "./newsletter.service.js";

export const subscribeNewsletterController = asyncHandler(async (req, res) => {
  const result = await subscribeToNewsletter(req.validated.body);

  res
    .status(201)
    .json(new ApiResponse(201, "Newsletter subscription saved", result));
});

export const getNewsletterSubscribersController = asyncHandler(
  async (req, res) => {
    const result = await getNewsletterSubscribers(req.query);

    res
      .status(200)
      .json(new ApiResponse(200, "Newsletter subscribers fetched", result));
  }
);
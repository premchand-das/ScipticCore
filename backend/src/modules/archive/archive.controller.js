import { createContentController } from "../shared/content.controller.factory.js";
import { archiveService } from "./archive.service.js";

export const archiveController = createContentController(
  archiveService,
  "Archive"
);
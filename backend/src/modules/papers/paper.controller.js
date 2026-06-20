import { createContentController } from "../shared/content.controller.factory.js";
import { paperService } from "./paper.service.js";

export const paperController = createContentController(paperService, "Paper");
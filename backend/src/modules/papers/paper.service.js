import { Paper } from "./paper.model.js";
import { createContentService } from "../shared/content.factory.js";

export const paperService = createContentService(Paper, "Paper");
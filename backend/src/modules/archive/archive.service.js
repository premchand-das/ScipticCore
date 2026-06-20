import { Archive } from "./archive.model.js";
import { createContentService } from "../shared/content.factory.js";

export const archiveService = createContentService(Archive, "Archive");
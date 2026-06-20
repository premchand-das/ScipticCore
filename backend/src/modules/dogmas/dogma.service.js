import { Dogma } from "./dogma.model.js";
import { createContentService } from "../shared/content.factory.js";

export const dogmaService = createContentService(Dogma, "Dogma");
export default dogmaService;
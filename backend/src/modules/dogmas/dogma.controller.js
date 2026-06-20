import { createContentController } from "../shared/content.controller.factory.js";
import { dogmaService } from "./dogma.service.js";

export const dogmaController = createContentController(dogmaService, "Dogma");
export default dogmaController;
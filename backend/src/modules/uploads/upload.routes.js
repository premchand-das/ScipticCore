import express from "express";
import { protectAdmin } from "../../middleware/auth.middleware.js";
import { upload } from "./upload.middleware.js";
import { uploadImageController } from "./upload.controller.js";

const router = express.Router();

router.post("/image", protectAdmin, upload.single("image"), uploadImageController);

export default router;
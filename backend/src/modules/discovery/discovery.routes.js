import express from "express";
import { getHomeDiscoveryController } from "./discovery.controller.js";

const router = express.Router();

router.get("/home", getHomeDiscoveryController);

export default router;
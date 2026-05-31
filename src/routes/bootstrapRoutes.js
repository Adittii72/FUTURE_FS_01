import express from "express";
import { getPublicBootstrap } from "../controllers/bootstrapController.js";

const router = express.Router();
router.get("/", getPublicBootstrap);

export default router;

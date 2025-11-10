import express from "express";
import { getSummary } from "../controllers/analyticsController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", auth, getSummary);

export default router;
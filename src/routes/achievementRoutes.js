import express from "express";
import {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
// GET /api/achievements
router.get("/", getAllAchievements);
// --- Admin (Protected) Routes ---
// POST /api/achievements
router.post("/", auth, createAchievement);
// PUT /api/achievements/:id
router.put("/:id", auth, updateAchievement);
// DELETE /api/achievements/:id
router.delete("/:id", auth, deleteAchievement);

export default router;
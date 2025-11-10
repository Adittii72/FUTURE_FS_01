import express from "express";
import {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  uploadAchievementImage, // <-- ADDED
} from "../controllers/achievementController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // <-- ADDED

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

// --- ADDED UPLOAD ROUTE ---
router.post(
  "/upload/:id",
  auth,
  upload.single("certificateImage"), // Field name
  uploadAchievementImage
);
// --- END ---

export default router;
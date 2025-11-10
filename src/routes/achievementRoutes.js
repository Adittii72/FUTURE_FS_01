import express from "express";
import {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  uploadAchievementImage,
} from "../controllers/achievementController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();
router.get("/", getAllAchievements);
router.post("/", auth, createAchievement);
router.put("/:id", auth, updateAchievement);
router.delete("/:id", auth, deleteAchievement);
router.post(
  "/upload/:id",
  auth,
  upload.single("certificateImage"),
  uploadAchievementImage
);


export default router;
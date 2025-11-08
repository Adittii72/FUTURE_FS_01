import express from "express";
import {
  getAbout,
  updateAbout,
  uploadAboutImage, 
} from "../controllers/aboutController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();

// --- Public Route ---
router.get("/", getAbout);
// --- Admin (Protected) Routes ---
// For updating text fields
router.put("/", auth, updateAbout);
router.post(
  "/upload",
  auth,
  upload.single("coverImage"),
  uploadAboutImage
);

export default router;
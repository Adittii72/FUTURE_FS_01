import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectMedia,
} from "../controllers/projectController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET /api/projects
router.get("/", getAllProjects);
// GET /api/projects/:id
router.get("/:id", getProjectById);
// --- Admin (Protected) Routes ---
// These rely on global body-parser for JSON (from index.js)
router.post("/", auth, createProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);

// --- FILE UPLOAD: Multer must be the ONLY body reader here ---
router.post(
  "/upload/:id",
  auth,
  upload.single("mediaFile"),
  uploadProjectMedia
);

export default router;
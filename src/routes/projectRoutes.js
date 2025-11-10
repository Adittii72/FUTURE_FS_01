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
router.post("/", auth, createProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);

// --- FILE UPLOAD: Using upload.fields ---
router.post(
  "/upload/:id",
  auth,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "imageFiles", maxCount: 5 },
  ]),
  uploadProjectMedia
);

export default router;
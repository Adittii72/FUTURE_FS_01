import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectMedia,
  deleteProjectImage,
} from "../controllers/projectController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();
// GET /api/projects
router.get("/", getAllProjects);
// GET /api/projects/:id
router.get("/:id", getProjectById);
// --- Admin (Protected) Routes ---
// POST /api/projects
router.post("/", auth, createProject);
// POST /api/projects/upload/:id
router.post(
  "/upload/:id",
  auth,
  upload.array("mediaFiles", 5),
  uploadProjectMedia
);
// PUT /api/projects/:id
router.put("/:id", auth, updateProject);
// DELETE /api/projects/:id
router.delete("/:id", auth, deleteProject);
router.delete("/image/:imageId", auth, deleteProjectImage);

export default router;
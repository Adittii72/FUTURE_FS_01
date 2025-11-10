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
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", auth, createProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);
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
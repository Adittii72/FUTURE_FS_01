import express from "express";
import {
  getResume,
  setResume,
  deleteResume,
  uploadResume,
} from "../controllers/resumeController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.get("/", getResume);
router.post("/", auth, setResume);
router.delete("/", auth, deleteResume);
router.post("/upload", auth, upload.single("resumeFile"), uploadResume);


export default router;
import express from "express";
import {
  getResume,
  setResume,
  deleteResume,
} from "../controllers/resumeController.js";
import auth from "../middleware/auth.js"

const router = express.Router();
// GET /api/resume
router.get("/", getResume);
// POST /api/resume (This will create or update)
router.post("/", auth, setResume);
// DELETE /api/resume (Your note shows /:id, but since there's only one, we can just delete it)
router.delete("/", auth, deleteResume);

export default router;
import express from "express";
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
// GET /api/skills
router.get("/", getAllSkills);
// POST /api/skills
router.post("/", auth, createSkill);
// PUT /api/skills/:id
router.put("/:id", auth, updateSkill);
// DELETE /api/skills/:id
router.delete("/:id", auth, deleteSkill);

export default router;
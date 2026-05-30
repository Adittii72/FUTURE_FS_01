import express from "express";
import {
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.get("/", getAllEducation);
router.post("/", auth, createEducation);
router.put("/:id", auth, updateEducation);
router.delete("/:id", auth, deleteEducation);

export default router;

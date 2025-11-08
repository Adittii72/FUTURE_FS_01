import express from "express";
import { getAbout, updateAbout } from "../controllers/aboutController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAbout);
router.put("/", auth, updateAbout);

export default router;

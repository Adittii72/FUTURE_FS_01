import express from "express";
import { login, profile } from "../controllers/adminController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/profile", auth, profile);

export default router;

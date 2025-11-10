import express from "express";
import {
  submitMessage,
  getAllMessages,
  deleteMessage,
} from "../controllers/contactController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.post("/", submitMessage);
router.get("/messages", auth, getAllMessages);
router.delete("/:id", auth, deleteMessage);

export default router;
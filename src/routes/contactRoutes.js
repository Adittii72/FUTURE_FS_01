import express from "express";
import {
  submitMessage,
  getAllMessages,
  deleteMessage,
} from "../controllers/contactController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
// POST /api/contact
router.post("/", submitMessage);
// --- Admin (Protected) Routes ---
// GET /api/contact/messages
router.get("/messages", auth, getAllMessages);
// DELETE /api/contact/:id
router.delete("/:id", auth, deleteMessage);

export default router;
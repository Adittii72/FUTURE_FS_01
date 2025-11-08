import ContactMessage from "../models/ContactMessage.js";
import { Op } from "sequelize"; 


// @route   POST /api/contact
// @access  Public
export const submitMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: "'name' and 'message' are required" });
    }


    const contactMessage = await ContactMessage.create({
      name,
      email: email || null,
      phone: phone || null,
      message,
    });

    return res.status(201).json({ message: "Message sent successfully", contactMessage });
  } catch (err) {
    console.error("submitMessage error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/contact/messages
// @access  Private (Admin)
export const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json({ messages });
  } catch (err) {
    console.error("getAllMessages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   DELETE /api/contact/:id
// @access  Private (Admin)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.destroy();

    return res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("deleteMessage error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
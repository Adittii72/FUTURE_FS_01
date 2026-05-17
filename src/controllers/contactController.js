import ContactMessage from "../models/ContactMessage.js";
import { sendThankYouEmail, sendAdminNotificationEmail } from "../utils/emailService.js";

export const submitMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log("\nNew contact form submission received");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Message length:", message?.length);

    if (!name || !message) {
      return res.status(400).json({ message: "'name' and 'message' are required" });
    }

    if (!email) {
      return res.status(400).json({ message: "'email' is required" });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || null,
      message,
    });

    const adminEmailResult = await sendAdminNotificationEmail({
      name,
      email,
      phone: phone || "Not provided",
      message,
    });

    const thankYouEmailResult = await sendThankYouEmail(email, name);

    return res.status(201).json({
      message: "Message sent successfully",
      contactMessage,
      emailStatus: {
        adminNotification: adminEmailResult.success,
        thankYouEmail: thankYouEmailResult.success,
      },
    });
  } catch (err) {
    console.error("submitMessage error:", err);
    return res.status(500).json({ message: "Server error: " + err.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json({ messages });
  } catch (err) {
    console.error("getAllMessages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const contactMessage = await ContactMessage.findByIdAndDelete(id);

    if (!contactMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("deleteMessage error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

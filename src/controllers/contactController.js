import supabase from "../config/supabase.js";
import { sendThankYouEmail, sendAdminNotificationEmail } from "../utils/emailService.js";

// @route   POST /api/contact
// @access  Public
export const submitMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log('\n📝 New contact form submission received');
    console.log('👤 Name:', name);
    console.log('📧 Email:', email);
    console.log('📱 Phone:', phone);
    console.log('💬 Message length:', message?.length);

    if (!name || !message) {
      return res.status(400).json({ message: "'name' and 'message' are required" });
    }

    if (!email) {
      return res.status(400).json({ message: "'email' is required" });
    }

    // Save message to database
    console.log('💾 Saving message to database...');
    const { data: contactMessage, error } = await supabase
      .from("contact_messages")
      .insert([{
        name,
        email,
        phone: phone || null,
        message,
      }])
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Message saved successfully. ID:', contactMessage.id);

    // Send admin notification email
    console.log('\n📬 Sending emails...');
    const adminEmailResult = await sendAdminNotificationEmail({
      name,
      email,
      phone: phone || 'Not provided',
      message
    });

    const thankYouEmailResult = await sendThankYouEmail(email, name);

    // Log results
    console.log('\n📊 Email Results:');
    console.log('Admin notification:', adminEmailResult.success ? '✅ Sent' : '❌ Failed');
    console.log('Thank you email:', thankYouEmailResult.success ? '✅ Sent' : '❌ Failed');

    // Return response with email status
    return res.status(201).json({
      message: "Message sent successfully",
      contactMessage,
      emailStatus: {
        adminNotification: adminEmailResult.success,
        thankYouEmail: thankYouEmailResult.success
      }
    });
  } catch (err) {
    console.error("❌ submitMessage error:", err);
    return res.status(500).json({ message: "Server error: " + err.message });
  }
};

// @route   GET /api/contact/messages
// @access  Private (Admin)
export const getAllMessages = async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;
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
    const contactMessage = await ContactMessage.findByPk(id);

    if (!contactMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    await contactMessage.destroy();

    return res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("deleteMessage error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

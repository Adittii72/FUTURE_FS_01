import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Achievement from "../models/Achievement.js";
import ContactMessage from "../models/ContactMessage.js";

// @route   GET /api/analytics/summary
// @access  Private (Admin)
export const getSummary = async (req, res) => {
  try {
    const [
      projectCount,
      skillCount,
      achievementCount,
      unreadMessagesCount,
    ] = await Promise.all([
      Project.count(),
      Skill.count(),
      Achievement.count(),
      ContactMessage.count({ where: { isRead: false } }),
    ]);

    const summary = {
      projects: projectCount,
      skills: skillCount,
      achievements: achievementCount,
      unreadMessages: unreadMessagesCount,
    };

    return res.json({ summary });
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
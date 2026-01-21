import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Achievement from "../models/Achievement.js";

// @route   GET /api/analytics/summary
// @access  Private (Admin)
export const getSummary = async (req, res) => {
  try {
    const [
      projectCount,
      skillCount,
      achievementCount,
    ] = await Promise.all([
      Project.count(),
      Skill.count(),
      Achievement.count(),
    ]);

    const summary = {
      projects: projectCount,
      skills: skillCount,
      achievements: achievementCount,
    };

    return res.json({ summary });
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Achievement from "../models/Achievement.js";

export const getSummary = async (req, res) => {
  try {
    const [projectCount, skillCount, achievementCount] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Achievement.countDocuments(),
    ]);

    return res.json({
      summary: {
        projects: projectCount,
        skills: skillCount,
        achievements: achievementCount,
      },
    });
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

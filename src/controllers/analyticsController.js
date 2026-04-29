import supabase from "../config/supabase.js";

// @route   GET /api/analytics/summary
// @access  Private (Admin)
export const getSummary = async (req, res) => {
  try {
    const [
      { count: projectCount },
      { count: skillCount },
      { count: achievementCount },
    ] = await Promise.all([
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("skills")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("achievements")
        .select("*", { count: "exact", head: true }),
    ]);

    const summary = {
      projects: projectCount || 0,
      skills: skillCount || 0,
      achievements: achievementCount || 0,
    };

    return res.json({ summary });
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
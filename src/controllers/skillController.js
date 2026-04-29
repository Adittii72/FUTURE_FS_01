import supabase from "../config/supabase.js";

// @route   GET /api/skills
// @access  Public
export const getAllSkills = async (req, res) => {
  try {
    const { data: skills, error } = await supabase
      .from("skills")
      .select("*")
      .order("percent", { ascending: false });

    if (error) throw error;
    return res.json({ skills });
  } catch (err) {
    console.error("getAllSkills error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   POST /api/skills
// @access  Private (Admin)
export const createSkill = async (req, res) => {
  try {
    const { name, level, percent } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Skill 'name' is required" });
    }

    const { data: skill, error } = await supabase
      .from("skills")
      .insert([{
        name,
        level: level || null,
        percent: percent || null,
      }])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({ message: "Skill with this name already exists" });
      }
      throw error;
    }

    return res.status(201).json({ message: "Skill created", skill });
  } catch (err) {
    console.error("createSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   PUT /api/skills/:id
// @access  Private (Admin)
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level, percent } = req.body;

    const { data: skill, error } = await supabase
      .from("skills")
      .update({
        name: name,
        level: level,
        percent: percent,
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    return res.json({ message: "Skill updated", skill });
  } catch (err) {
    console.error("updateSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   DELETE /api/skills/:id
// @access  Private (Admin)
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(404).json({ message: "Skill not found" });
    }

    return res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    console.error("deleteSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
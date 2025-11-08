import Skill from "../models/Skill.js";

// @route   GET /api/skills
// @access  Public
export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({
      order: [["percent", "DESC"]],
    });
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

    const skill = await Skill.create({
      name,
      level: level || null,
      percent: percent || null,
    });

    return res.status(201).json({ message: "Skill created", skill });
  } catch (err) {
    console.error("createSkill error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Skill with this name already exists" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};


// @route   PUT /api/skills/:id
// @access  Private (Admin)
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level, percent } = req.body;

    const skill = await Skill.findByPk(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    await skill.update({
      name: name ?? skill.name,
      level: level ?? skill.level,
      percent: percent ?? skill.percent,
    });

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
    const skill = await Skill.findByPk(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await skill.destroy();

    return res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    console.error("deleteSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
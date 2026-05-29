import Skill from "../models/Skill.js";

export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ percent: -1 });
    return res.json({ skills });
  } catch (err) {
    console.error("getAllSkills error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { name, level, percent, icon, category } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Skill 'name' is required" });
    }

    const skill = await Skill.create({
      name,
      level: level || null,
      percent: percent === "" || percent === undefined ? null : Number(percent),
      icon: icon || null,
      category: category || "Other",
    });

    return res.status(201).json({ message: "Skill created", skill });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Skill with this name already exists" });
    }

    console.error("createSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level, percent, icon, category } = req.body;

    const skill = await Skill.findByIdAndUpdate(
      id,
      {
        name,
        level,
        percent: percent === "" || percent === undefined ? null : Number(percent),
        icon: icon || null,
        category: category || "Other",
      },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    return res.json({ message: "Skill updated", skill });
  } catch (err) {
    console.error("updateSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    return res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    console.error("deleteSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

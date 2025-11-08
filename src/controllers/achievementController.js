import Achievement from "../models/Achievement.js";

// @route   GET /api/achievements
// @access  Public
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.json({ achievements });
  } catch (err)
 {
    console.error("getAllAchievements error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// @route   POST /api/achievements
// @access  Private (Admin)
export const createAchievement = async (req, res) => {
  try {
    const { title, description, issuer, fileUrl, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Achievement 'title' is required" });
    }

    const achievement = await Achievement.create({
      title,
      description: description || null,
      issuer: issuer || null,
      fileUrl: fileUrl || null,
      category: category || null,
    });

    return res.status(201).json({ message: "Achievement created", achievement });
  } catch (err) {
    console.error("createAchievement error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// @route   PUT /api/achievements/:id
// @access  Private (Admin)
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, issuer, fileUrl, category } = req.body;

    const achievement = await Achievement.findByPk(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    await achievement.update({
      title: title ?? achievement.title,
      description: description ?? achievement.description,
      issuer: issuer ?? achievement.issuer,
      fileUrl: fileUrl ?? achievement.fileUrl,
      category: category ?? achievement.category,
    });

    return res.json({ message: "Achievement updated", achievement });
  } catch (err) {
    console.error("updateAchievement error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   DELETE /api/achievements/:id
// @access  Private (Admin)
export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findByPk(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    await achievement.destroy();

    return res.json({ message: "Achievement deleted successfully" });
  } catch (err) {
    console.error("deleteAchievement error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
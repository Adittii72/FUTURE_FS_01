import Achievement from "../models/Achievement.js";

// GET /api/achievements
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.json({ achievements });
  } catch (err) {
    console.error("getAllAchievements error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/achievements
export const createAchievement = async (req, res) => {
  try {
    const { title, description, imageUrl, date } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Achievement 'title' is required" });
    }

    const achievement = await Achievement.create({
      title,
      description: description || null,
      imageUrl: imageUrl || null,
      date: date || null,
    });

    return res.status(201).json({ achievement });
  } catch (err) {
    console.error("createAchievement error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/achievements/:id
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, date } = req.body;

    const achievement = await Achievement.findByPk(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    await achievement.update({
      title: title ?? achievement.title,
      description: description ?? achievement.description,
      imageUrl: imageUrl ?? achievement.imageUrl,
      date: date ?? achievement.date,
    });

    return res.json({ achievement });
  } catch (err) {
    console.error("updateAchievement error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/achievements/:id
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

// POST /api/achievements/upload/:id
export const uploadAchievementImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const achievement = await Achievement.findByPk(id);
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    // ✅ STORE RELATIVE PATH ONLY
    const fileUrl = `/uploads/${req.file.filename}`;

    await achievement.update({
      imageUrl: fileUrl,
    });

    return res.json({ achievement });
  } catch (err) {
    console.error("uploadAchievementImage error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

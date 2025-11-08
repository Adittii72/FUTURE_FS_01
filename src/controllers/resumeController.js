import Resume from "../models/Resume.js";

// @route   GET /api/resume
// @access  Public
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.json({ resume });
  } catch (err) {
    console.error("getResume error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   POST /api/resume
// @access  Private (Admin)
export const setResume = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: "'fileUrl' is required" });
    }
    let resume = await Resume.findOne();

    if (resume) {
      await resume.update({ fileUrl });
      return res.json({ message: "Resume updated", resume });
    } else {
      resume = await Resume.create({ fileUrl });
      return res.status(201).json({ message: "Resume created", resume });
    }
  } catch (err) {
    console.error("setResume error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   DELETE /api/resume
// @access  Private (Admin)
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    await resume.destroy();
    return res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("deleteResume error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
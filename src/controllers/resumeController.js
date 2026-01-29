import Resume from "../models/Resume.js";
import { uploadToSupabase } from "../utils/storage.js";

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


// @route   POST /api/resume/upload
// @access  Private (Admin)
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Supabase Storage
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";
    const ext = req.file.originalname.split(".").pop() || "pdf";
    const filePath = `resume/resume-${Date.now()}.${ext}`;

    const publicUrl = await uploadToSupabase({
      bucket,
      path: filePath,
      fileBuffer: req.file.buffer,
      contentType: req.file.mimetype,
    });

    let resume = await Resume.findOne();

    if (resume) {
      await resume.update({ fileUrl: publicUrl });
      return res.json({ message: "Resume uploaded", resume });
    } else {
      resume = await Resume.create({ fileUrl: publicUrl });
      return res.status(201).json({ message: "Resume created", resume });
    }
  } catch (err) {
    console.error("uploadResume error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
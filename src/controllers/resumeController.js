import Resume from "../models/Resume.js";
import { uploadToSupabase } from "../utils/storage.js";

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

export const setResume = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: "'fileUrl' is required" });
    }

    let resume = await Resume.findOne();
    let status = 200;
    let message = "Resume updated";

    if (!resume) {
      resume = await Resume.create({ fileUrl });
      status = 201;
      message = "Resume created";
    } else {
      resume.fileUrl = fileUrl;
      await resume.save();
    }

    return res.status(status).json({ message, resume });
  } catch (err) {
    console.error("setResume error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete();

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("deleteResume error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

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
    let status = 200;
    let message = "Resume uploaded";

    if (!resume) {
      resume = await Resume.create({ fileUrl: publicUrl });
      status = 201;
      message = "Resume created";
    } else {
      resume.fileUrl = publicUrl;
      await resume.save();
    }

    return res.status(status).json({ message, resume });
  } catch (err) {
    console.error("uploadResume error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

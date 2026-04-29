import supabase from "../config/supabase.js";
import { uploadToSupabase } from "../utils/storage.js";

// @route   GET /api/resume
// @access  Public
export const getResume = async (req, res) => {
  try {
    const { data: resumeArray, error } = await supabase
      .from("resumes")
      .select("*");

    if (error) throw error;

    const resume = resumeArray && resumeArray.length > 0 ? resumeArray[0] : null;
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

    // Get existing resume
    const { data: resumeArray } = await supabase
      .from("resumes")
      .select("*");

    let resume = resumeArray && resumeArray.length > 0 ? resumeArray[0] : null;

    if (resume) {
      const { data: updated, error } = await supabase
        .from("resumes")
        .update({ fileUrl })
        .eq("id", resume.id)
        .select()
        .single();

      if (error) throw error;
      return res.json({ message: "Resume updated", resume: updated });
    } else {
      const { data: created, error } = await supabase
        .from("resumes")
        .insert([{ fileUrl }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ message: "Resume created", resume: created });
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
    const { data: resumeArray } = await supabase
      .from("resumes")
      .select("*");

    const resume = resumeArray && resumeArray.length > 0 ? resumeArray[0] : null;
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resume.id);

    if (error) throw error;
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

    // Get existing resume
    const { data: resumeArray } = await supabase
      .from("resumes")
      .select("*");

    let resume = resumeArray && resumeArray.length > 0 ? resumeArray[0] : null;

    if (resume) {
      const { data: updated, error } = await supabase
        .from("resumes")
        .update({ fileUrl: publicUrl })
        .eq("id", resume.id)
        .select()
        .single();

      if (error) throw error;
      return res.json({ message: "Resume uploaded", resume: updated });
    } else {
      const { data: created, error } = await supabase
        .from("resumes")
        .insert([{ fileUrl: publicUrl }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ message: "Resume created", resume: created });
    }
  } catch (err) {
    console.error("uploadResume error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
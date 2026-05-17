import Project from "../models/Project.js";
import { uploadToSupabase } from "../utils/storage.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json({ projects });
  } catch (err) {
    console.error("getAllProjects error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({ project });
  } catch (err) {
    console.error("getProjectById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const project = await Project.create({
      title,
      description,
      techStack: techStack || null,
      githubUrl: githubUrl || null,
    });

    return res.status(201).json({ project });
  } catch (err) {
    console.error("createProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, techStack, githubUrl },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({ project });
  } catch (err) {
    console.error("updateProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("deleteProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadProjectMedia = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";

    if (req.files?.videoFile) {
      const video = req.files.videoFile[0];
      const ext = video.originalname.split(".").pop() || "mp4";
      const filePath = `projects/${project.id}/video-${Date.now()}.${ext}`;

      const publicUrl = await uploadToSupabase({
        bucket,
        path: filePath,
        fileBuffer: video.buffer,
        contentType: video.mimetype,
      });

      project.videoUrl = publicUrl;
      project.images = [];
    }

    if (req.files?.imageFiles) {
      const imagePromises = req.files.imageFiles.map(async (file, index) => {
        const ext = file.originalname.split(".").pop() || "jpg";
        const filePath = `projects/${project.id}/images/${Date.now()}-${index}.${ext}`;

        const publicUrl = await uploadToSupabase({
          bucket,
          path: filePath,
          fileBuffer: file.buffer,
          contentType: file.mimetype,
        });

        return { imageUrl: publicUrl };
      });

      project.images = await Promise.all(imagePromises);
      project.videoUrl = null;
    }

    await project.save();
    return res.json({ project });
  } catch (err) {
    console.error("uploadProjectMedia error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

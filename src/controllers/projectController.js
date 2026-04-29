import supabase from "../config/supabase.js";
import { uploadToSupabase } from "../utils/storage.js";

/* =========================
   GET ALL PROJECTS
========================= */
export const getAllProjects = async (req, res) => {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*, project_images(id, imageUrl)")
      .order("createdAt", { ascending: false });

    if (error) throw error;

    // Transform data to match frontend expectations
    const transformedProjects = projects.map((p) => ({
      ...p,
      images: p.project_images || [],
    }));

    return res.json({ projects: transformedProjects });
  } catch (err) {
    console.error("getAllProjects error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET PROJECT BY ID
========================= */
export const getProjectById = async (req, res) => {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select("*, project_images(id, imageUrl)")
      .eq("id", req.params.id)
      .single();

    if (error || !project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({
      project: {
        ...project,
        images: project.project_images || [],
      },
    });
  } catch (err) {
    console.error("getProjectById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   CREATE PROJECT
========================= */
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const { data: project, error } = await supabase
      .from("projects")
      .insert([
        {
          title,
          description,
          techStack: techStack || null,
          githubUrl: githubUrl || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ project });
  } catch (err) {
    console.error("createProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE PROJECT
========================= */
export const updateProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl } = req.body;

    const { data: project, error } = await supabase
      .from("projects")
      .update({
        title: title,
        description: description,
        techStack: techStack,
        githubUrl: githubUrl,
      })
      .eq("id", req.params.id)
      .select("*, project_images(id, imageUrl)")
      .single();

    if (error || !project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({
      project: {
        ...project,
        images: project.project_images || [],
      },
    });
  } catch (err) {
    console.error("updateProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE PROJECT
========================= */
export const deleteProject = async (req, res) => {
  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("deleteProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPLOAD PROJECT MEDIA
========================= */
export const uploadProjectMedia = async (req, res) => {
  try {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", req.params.id)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";

    // VIDEO UPLOAD
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

      const { error: updateError } = await supabase
        .from("projects")
        .update({ videoUrl: publicUrl })
        .eq("id", project.id);

      if (updateError) throw updateError;

      // Delete existing images
      await supabase
        .from("project_images")
        .delete()
        .eq("projectId", project.id);
    }

    // IMAGE UPLOAD
    if (req.files?.imageFiles) {
      // Delete existing images
      await supabase
        .from("project_images")
        .delete()
        .eq("projectId", project.id);

      // Upload all images to Supabase and get URLs
      const imagePromises = req.files.imageFiles.map(async (file, index) => {
        const ext = file.originalname.split(".").pop() || "jpg";
        const filePath = `projects/${project.id}/images/${Date.now()}-${index}.${ext}`;

        const publicUrl = await uploadToSupabase({
          bucket,
          path: filePath,
          fileBuffer: file.buffer,
          contentType: file.mimetype,
        });

        return {
          imageUrl: publicUrl,
          projectId: project.id,
        };
      });

      const images = await Promise.all(imagePromises);

      const { error: insertError } = await supabase
        .from("project_images")
        .insert(images);

      if (insertError) throw insertError;

      // Clear video URL
      await supabase
        .from("projects")
        .update({ videoUrl: null })
        .eq("id", project.id);
    }

    const { data: updated, error: selectError } = await supabase
      .from("projects")
      .select("*, project_images(id, imageUrl)")
      .eq("id", project.id)
      .single();

    if (selectError) throw selectError;

    return res.json({
      project: {
        ...updated,
        images: updated.project_images || [],
      },
    });
  } catch (err) {
    console.error("uploadProjectMedia error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

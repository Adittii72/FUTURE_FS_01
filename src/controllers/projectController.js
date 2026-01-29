import Project from "../models/Project.js";
import ProjectImage from "../models/ProjectImage.js";
import sequelize from "../config/database.js";

/* =========================
   GET ALL PROJECTS
========================= */
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [["createdAt", "DESC"]],
      include: {
        model: ProjectImage,
        as: "images",
        attributes: ["id", "imageUrl"],
      },
    });

    return res.json({ projects });
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
    const project = await Project.findByPk(req.params.id, {
      include: {
        model: ProjectImage,
        as: "images",
        attributes: ["id", "imageUrl"],
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({ project });
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

/* =========================
   UPDATE PROJECT
========================= */
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { title, description, techStack, githubUrl } = req.body;

    await project.update({
      title: title ?? project.title,
      description: description ?? project.description,
      techStack: techStack ?? project.techStack,
      githubUrl: githubUrl ?? project.githubUrl,
    });

    return res.json({ project });
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
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.destroy();
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
  const t = await sequelize.transaction();

  try {
    const project = await Project.findByPk(req.params.id, { transaction: t });

    if (!project) {
      await t.rollback();
      return res.status(404).json({ message: "Project not found" });
    }

    const getPath = (file) => `/uploads/${file.filename}`;

    // VIDEO UPLOAD
    if (req.files?.videoFile) {
      const video = req.files.videoFile[0];
      project.videoUrl = getPath(video);
      await project.save({ transaction: t });

      await ProjectImage.destroy({
        where: { projectId: project.id },
        transaction: t,
      });
    }

    // IMAGE UPLOAD
    if (req.files?.imageFiles) {
      await ProjectImage.destroy({
        where: { projectId: project.id },
        transaction: t,
      });

      const images = req.files.imageFiles.map((file) => ({
        imageUrl: getPath(file),
        projectId: project.id,
      }));

      await ProjectImage.bulkCreate(images, { transaction: t });
      project.videoUrl = null;
      await project.save({ transaction: t });
    }

    await t.commit();

    const updated = await Project.findByPk(project.id, {
      include: { model: ProjectImage, as: "images" },
    });

    return res.json({ project: updated });
  } catch (err) {
    await t.rollback();
    console.error("uploadProjectMedia error:", err);
    return res.status(500).json({ message: "Media upload failed" });
  }
};

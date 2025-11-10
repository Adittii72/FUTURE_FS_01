import Project from "../models/Project.js";
import ProjectImage from "../models/ProjectImage.js";
import sequelize from "../config/database.js";

// @route   GET /api/projects
// @access  Public
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

// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
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

// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Project 'title' and 'description' are required" });
    }

    const project = await Project.create({
      title,
      description,
      techStack: techStack || null,
      githubUrl: githubUrl || null,
    });

    return res.status(201).json({ message: "Project created", project });
  } catch (err) {
    console.error("createProject error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "Project with this title already exists" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, techStack, githubUrl, videoUrl } = req.body;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.update({
      title: title ?? project.title,
      description: description ?? project.description,
      techStack: techStack ?? project.techStack,
      githubUrl: githubUrl ?? project.githubUrl,
      videoUrl: videoUrl ?? project.videoUrl,
    });

    return res.json({ message: "Project updated", project });
  } catch (err) {
    console.error("updateProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

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

// @route   POST /api/projects/upload/:id
// @access  Private (Admin)
// --- This is the full logic for handling BOTH video and images ---
export const uploadProjectMedia = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction(); 

  try {
    const project = await Project.findByPk(id, { transaction: t });
    if (!project) {
      await t.rollback();
      return res.status(404).json({ message: "Project not found" });
    }

    const hasVideo = req.files && req.files.videoFile;
    const hasImages = req.files && req.files.imageFiles;
    const getUrl = (file) =>
      `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    if (hasVideo) {
      const videoFile = req.files.videoFile[0];

      if (videoFile.size > 50 * 1024 * 1024) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "Video file exceeds 50MB limit" });
      }

      const videoUrl = getUrl(videoFile);

      project.videoUrl = videoUrl;
      await project.save({ transaction: t });

      await ProjectImage.destroy({
        where: { projectId: id },
        transaction: t,
      });
    } else if (hasImages) {
      const imageFiles = req.files.imageFiles;

      project.videoUrl = null;
      await project.save({ transaction: t });

      await ProjectImage.destroy({
        where: { projectId: id },
        transaction: t,
      });
      const imageRecords = imageFiles.map((file) => ({
        imageUrl: getUrl(file),
        projectId: id,
      }));

      await ProjectImage.bulkCreate(imageRecords, { transaction: t });
    } else {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "No video or image files were uploaded" });
    }

    await t.commit();

    const updatedProject = await Project.findByPk(id, {
      include: { model: ProjectImage, as: "images" },
    });

    return res.json({
      message: "Media uploaded successfully",
      project: updatedProject,
    });
  } catch (err) {
    await t.rollback();
    console.error("uploadProjectMedia error:", err);
    if (err.message?.includes("Only video")) {
      return res
        .status(400)
        .json({
          message: "Upload failed: Only video files are allowed in the video field.",
        });
    }
    if (err.message?.includes("Only image")) {
      return res
        .status(400)
        .json({
          message: "Upload failed: Only image files are allowed in the images field.",
        });
    }
    return res.status(500).json({ message: "Server error during media upload" });
  }
};
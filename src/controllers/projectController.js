import Project from "../models/Project.js";

// @route   GET /api/projects
// @access  Public
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [["createdAt", "DESC"]],
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
    const project = await Project.findByPk(id);

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
    const { title, description, techStack, githubUrl, coverImageUrl, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Project 'title' and 'description' are required" });
    }

    const project = await Project.create({
      title,
      description,
      techStack: techStack || null,
      githubUrl: githubUrl || null,
      coverImageUrl: coverImageUrl || null,
      category: category || null,
    });

    return res.status(201).json({ message: "Project created", project });
  } catch (err) {
    console.error("createProject error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Project with this title already exists" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, techStack, githubUrl, coverImageUrl, category } = req.body;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.update({
      title: title ?? project.title,
      description: description ?? project.description,
      techStack: techStack ?? project.techStack,
      githubUrl: githubUrl ?? project.githubUrl,
      coverImageUrl: coverImageUrl ?? project.coverImageUrl,
      category: category ?? project.category,
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
export const uploadProjectMedia = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    await project.update({
      coverImageUrl: fileUrl,
    });

    return res.json({ message: "File uploaded successfully", project });
  } catch (err) {
    console.error("uploadProjectMedia error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
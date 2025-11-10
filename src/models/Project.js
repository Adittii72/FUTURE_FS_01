import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
// import ProjectImage from "./ProjectImage.js"; // <-- REMOVED

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    techStack: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    githubUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 'category' field is removed as requested
  },
  {
    tableName: "projects",
    timestamps: true,
    hooks: {
      beforeCreate: (project) => {
        if (project.title) project.title = project.title.trim();
      },
      beforeUpdate: (project) => {
        if (project.title) project.title = project.title.trim();
      },
    },
  }
);

// --- ASSOCIATION REMOVED FROM HERE ---

export default Project;
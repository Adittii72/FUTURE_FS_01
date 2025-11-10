import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
// import Project from "./Project.js"; // <-- REMOVED

const ProjectImage = sequelize.define(
  "ProjectImage",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
    },
  },
  {
    tableName: "project_images",
    timestamps: true,
  }
);

// --- ASSOCIATION REMOVED FROM HERE ---
// The line 'ProjectImage.belongsTo(Project, ...)' that was here is
// what caused the crash. It has been permanently removed from this file.
// --- END ---

export default ProjectImage;
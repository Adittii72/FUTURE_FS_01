import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
      validate: {
        isUrl: true,
      },
    },
    coverImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        // isUrl: true,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    tableName: "projects",
    timestamps: true,
    hooks: {
      beforeCreate: (project) => {
        if (project.title) project.title = project.title.trim();
        if (project.category) project.category = project.category.trim();
      },
      beforeUpdate: (project) => {
        if (project.title) project.title = project.title.trim();
        if (project.category) project.category = project.category.trim();
      },
    },
  }
);

export default Project;

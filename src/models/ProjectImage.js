import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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



export default ProjectImage;
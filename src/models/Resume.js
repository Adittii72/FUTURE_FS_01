import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Resume = sequelize.define(
  "Resume",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },

  },
  {
    tableName: "resumes",
    timestamps: true,
  }
);

export default Resume;

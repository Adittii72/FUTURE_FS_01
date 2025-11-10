import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Achievement = sequelize.define(
  "Achievement",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "achievements",
    timestamps: true,
    hooks: {
      beforeCreate: (achievement) => {
        if (achievement.title) achievement.title = achievement.title.trim();
      },
      beforeUpdate: (achievement) => {
        if (achievement.title) achievement.title = achievement.title.trim();
      },
    },
  }
);

export default Achievement;
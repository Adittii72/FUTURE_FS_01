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
    issuer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    tableName: "achievements",
    timestamps: true,
    hooks: {
      beforeCreate: (achievement) => {
        if (achievement.title) achievement.title = achievement.title.trim();
        if (achievement.issuer) achievement.issuer = achievement.issuer.trim();
        if (achievement.category) achievement.category = achievement.category.trim();
      },
      beforeUpdate: (achievement) => {
        if (achievement.title) achievement.title = achievement.title.trim();
        if (achievement.issuer) achievement.issuer = achievement.issuer.trim();
        if (achievement.category) achievement.category = achievement.category.trim();
      },
    },
  }
);

export default Achievement;

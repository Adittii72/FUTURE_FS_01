import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const About = sequelize.define(
  "About",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    headline: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    github: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        // isUrl: true,
      },
    },
  },
  {
    tableName: "about",
    timestamps: true,
    hooks: {
      beforeCreate: (instance) => {
        if (instance.linkedin) instance.linkedin = instance.linkedin.trim();
        if (instance.github) instance.github = instance.github.trim();
        if (instance.coverImageUrl) instance.coverImageUrl = instance.coverImageUrl.trim();
      },
      beforeUpdate: (instance) => {
        if (instance.linkedin) instance.linkedin = instance.linkedin.trim();
        if (instance.github) instance.github = instance.github.trim();
        if (instance.coverImageUrl) instance.coverImageUrl = instance.coverImageUrl.trim();
      },
    },
  }
);

export default About;

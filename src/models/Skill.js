import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Skill = sequelize.define(
  "Skill",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    percent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    
  },
  {
    tableName: "skills",
    timestamps: true,
    hooks: {
      beforeCreate: (skill) => {
        if (skill.name) skill.name = skill.name.trim();
      },
      beforeUpdate: (skill) => {
        if (skill.name) skill.name = skill.name.trim();
      },
    },
  }
);

export default Skill;

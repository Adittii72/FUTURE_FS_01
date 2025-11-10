import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";

const SALT_ROUNDS = 10;

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "admins",
    timestamps: true,
    hooks: {
      beforeCreate: (admin) => {
        if (admin.email) admin.email = admin.email.trim().toLowerCase();
      },
      beforeUpdate: (admin) => {
        if (admin.email) admin.email = admin.email.trim().toLowerCase();
      },
    },
  }
);


Admin.prototype.setPassword = async function (plainPassword) {
  const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  this.passwordHash = hash;
  return this.passwordHash;
};


Admin.prototype.validatePassword = async function (plainPassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plainPassword, this.passwordHash);
};

export default Admin;

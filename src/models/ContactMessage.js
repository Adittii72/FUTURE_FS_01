import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ContactMessage = sequelize.define(
  "ContactMessage",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    
  },
  {
    tableName: "contact_messages",
    timestamps: true,
    hooks: {
      beforeCreate: (msg) => {
        if (msg.name) msg.name = msg.name.trim();
        if (msg.email) msg.email = msg.email.trim().toLowerCase();
        if (msg.phone) msg.phone = msg.phone.trim();
      },
      beforeUpdate: (msg) => {
        if (msg.name) msg.name = msg.name.trim();
        if (msg.email) msg.email = msg.email.trim().toLowerCase();
        if (msg.phone) msg.phone = msg.phone.trim();
      },
    },
  }
);

export default ContactMessage;

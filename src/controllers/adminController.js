import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_EXPIRES_IN = "7d";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!admin || !admin.isActive) return res.status(401).json({ message: "Invalid credentials" });

    const match = await admin.validatePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: admin.id, email: admin.email, role: admin.role || "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const profile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, { attributes: ["id", "name", "email", "isActive", "createdAt", "updatedAt"] });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    return res.json({ admin });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

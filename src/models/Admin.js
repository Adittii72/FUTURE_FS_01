import mongoose from "mongoose";
import bcrypt from "bcrypt";
import schemaOptions from "./schemaOptions.js";

const SALT_ROUNDS = 10;

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String },
    password: { type: String, select: false },
    isActive: { type: Boolean, default: true },
    role: { type: String, default: "admin" },
  },
  { ...schemaOptions, collection: "admins" }
);

adminSchema.methods.setPassword = async function (plainPassword) {
  this.passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return this.passwordHash;
};

adminSchema.methods.validatePassword = async function (plainPassword) {
  const hash = this.passwordHash || this.password;
  if (!hash) return false;
  return bcrypt.compare(plainPassword, hash);
};

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);

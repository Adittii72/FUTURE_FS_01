import mongoose from "mongoose";
import schemaOptions from "./schemaOptions.js";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    level: { type: String, trim: true, default: null },
    percent: { type: Number, min: 0, max: 100, default: null },
    icon: { type: String, trim: true, default: null, maxlength: 10000 }, // Icon URL or SVG code
    category: { type: String, trim: true, default: "AI & Data Science" }, // Featured, Languages, Frontend, Backend, Database, Tools, AI & Data Science
  },
  { ...schemaOptions, collection: "skills" }
);

export default mongoose.models.Skill || mongoose.model("Skill", skillSchema);

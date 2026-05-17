import mongoose from "mongoose";
import schemaOptions from "./schemaOptions.js";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    level: { type: String, trim: true, default: null },
    percent: { type: Number, min: 0, max: 100, default: null },
  },
  { ...schemaOptions, collection: "skills" }
);

export default mongoose.models.Skill || mongoose.model("Skill", skillSchema);

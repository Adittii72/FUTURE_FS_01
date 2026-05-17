import mongoose from "mongoose";
import schemaOptions from "./schemaOptions.js";

const resumeSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, trim: true, default: "" },
  },
  { ...schemaOptions, collection: "resumes" }
);

export default mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

import mongoose from "mongoose";
import schemaOptions from "./schemaOptions.js";

const aboutSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "Your Name" },
    headline: { type: String, trim: true, default: null },
    bio: { type: String, default: null },
    linkedin: { type: String, trim: true, default: null },
    github: { type: String, trim: true, default: null },
    location: { type: String, trim: true, default: null },
    coverImageUrl: { type: String, trim: true, default: null },
    profileImageUrl: { type: String, trim: true, default: null },
  },
  { ...schemaOptions, collection: "about" }
);

export default mongoose.models.About || mongoose.model("About", aboutSchema);

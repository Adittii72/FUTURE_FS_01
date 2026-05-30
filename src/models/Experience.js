import mongoose from "mongoose";
import schemaOptions from "./schemaOptions.js";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: null },
    startDate: { type: String, required: true, trim: true }, // Format: "YYYY-MM" or "YYYY"
    endDate: { type: String, trim: true, default: null }, // Format: "YYYY-MM" or "YYYY"
    description: { type: String, trim: true, default: null },
    isPresent: { type: Boolean, default: false }, // Currently working
  },
  { ...schemaOptions, collection: "experience" }
);

export default mongoose.models.Experience || mongoose.model("Experience", experienceSchema);

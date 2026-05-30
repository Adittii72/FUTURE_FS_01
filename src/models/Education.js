import mongoose from "mongoose";
import schemaOptions from "./schemaOptions.js";

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: null },
    startDate: { type: String, required: true, trim: true }, // Format: "YYYY-MM" or "YYYY"
    endDate: { type: String, trim: true, default: null }, // Format: "YYYY-MM" or "YYYY"
    description: { type: String, trim: true, default: null },
    isPresent: { type: Boolean, default: false }, // Currently studying
  },
  { ...schemaOptions, collection: "education" }
);

export default mongoose.models.Education || mongoose.model("Education", educationSchema);

import mongoose from "mongoose";
import schemaOptions from "./schemaOptions.js";

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    imageUrl: { type: String, trim: true, default: null },
    date: { type: String, default: null },
  },
  { ...schemaOptions, collection: "achievements" }
);

export default mongoose.models.Achievement ||
  mongoose.model("Achievement", achievementSchema);

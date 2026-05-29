import mongoose from "mongoose";
import schemaOptions from "./schemaOptions.js";

const projectImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
  },
  {
    _id: true,
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

projectImageSchema.virtual("id").get(function () {
  return this._id.toString();
});

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true },
    techStack: { type: String, trim: true, default: null },
    githubUrl: { type: String, trim: true, default: null },
    videoUrl: { type: String, trim: true, default: null },
    images: { type: [projectImageSchema], default: [] },
    category: { 
      type: String, 
      trim: true, 
      enum: ['AI Engineer', 'Data Science Enthusiast', 'Full-Stack Developer'],
      default: 'Full-Stack Developer' 
    },
  },
  { ...schemaOptions, collection: "projects" }
);

export default mongoose.models.Project || mongoose.model("Project", projectSchema);

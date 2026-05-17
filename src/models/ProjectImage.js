import mongoose from "mongoose";

const projectImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  },
  {
    collection: "project_images",
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.projectId = ret.projectId?.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

export default mongoose.models.ProjectImage ||
  mongoose.model("ProjectImage", projectImageSchema);

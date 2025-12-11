import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    description: { type: String },

    billing_rate: { type: Number, required: true },

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },

    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;

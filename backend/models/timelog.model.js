import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hours: {
      type: Number,
      required: true,
      min: 0.1,
    },

    notes: {
      type: String,
      default: "",
    },

    log_date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
  },
  { timestamps: true }
);

const TimeLog =
  mongoose.models.TimeLog || mongoose.model("TimeLog", timeLogSchema);
export default TimeLog;

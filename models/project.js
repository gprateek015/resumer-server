import { Schema, model } from "mongoose";
import UserProfile from "./user-profile.js";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    skills_required: [
      {
        type: String,
      },
    ],
    description: [
      {
        type: String,
      },
    ],
    code_url: String,
    live_url: String,
    video_url: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);

const Project = model("Project", projectSchema);
export default Project;

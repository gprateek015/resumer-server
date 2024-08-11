import { Schema, model } from "mongoose";
import UserProfile from "./user-profile.js";

const educationSchema = new Schema(
  {
    level: {
      type: String,
      required: false, // Should be true
      enum: [
        "lower_secondary",
        "senior_secondary",
        "diploma",
        "graduation",
        "post_graduation",
      ],
    },
    institute_name: {
      type: String,
      required: true,
    },
    start_year: {
      type: Number,
      required: false,
    },
    end_year: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    scoring_type: {
      type: String,
      required: true,
      enum: ["cgpa", "percentage"],
    },
    maximum_score: {
      type: Number,
      required: true,
    },
    specialisation: {
      // required for levels senior_secondary | diploma | graduation | post_graduation
      type: String,
      required: false,
    },
    degree: {
      // required for levels graduation | post_graduation
      type: String,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },
  },
  {
    versionKey: 0,
    toJSON: {
      virtuals: true,
    },
  }
);

const Education = model("Education", educationSchema);
export default Education;

import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
      required: false,
    },
  },
  {
    versionKey: 0,
    toJSON: {
      virtuals: true,
    },
  }
);

const Review = model("Review", reviewSchema);
export default Review;

import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: String,
    image: String,
    emailVerified: Boolean,
    password: String,
  },
  {
    versionKey: 0,
    toJSON: {
      virtuals: true,
    },
  }
);

const User = model("User", userSchema);
export default User;

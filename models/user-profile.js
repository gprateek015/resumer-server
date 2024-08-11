import { Schema, model } from "mongoose";

const profileLinkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const userProfileSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female", "other"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    profile_links: [profileLinkSchema], // Coding profiles
    certificates: [profileLinkSchema], // Same schema
    linkedin: String,
    github: String,
    twitter: String,
    portfolio: String,
    achievements: [
      {
        type: String,
      },
    ],
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    referred_by: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    referral_code: {
      type: String,
      required: true,
      unique: true,
    },
    user_role: {
      type: String,
      enum: ["admin", "user", "org_head"],
      default: "user",
      required: true,
    },
    resumes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resume",
      },
    ],
    default_resume_id: {
      type: String,
    },
    onboarding_completed: {
      type: Boolean,
      default: false,
    },
    r_coins: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    versionKey: false,
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userProfileSchema.statics.updateRCoinsForAllUserProfiles = async function (
  r_coins
) {
  try {
    console.log("started");
    const result = await this.updateMany(
      {},
      { $set: { r_coins } },
      { upsert: true }
    );

    console.log(result);

    console.log(`Updated ${result.modifiedCount} users.`);
  } catch (error) {
    console.error("Error updating users:", error);
  }
};

const UserProfile = model("UserProfile", userProfileSchema);
export default UserProfile;

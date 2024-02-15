import { Schema, model } from 'mongoose';

const profileLinkSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    city: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
    country: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    gender: {
      type: String,
      required: false,
      enum: ['male', 'female', 'other']
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    hash_password: {
      type: String,
      required: false
    },
    profile_links: [profileLinkSchema], // Coding profiles
    certificates: [profileLinkSchema], // Coding profiles
    linkedin: String,
    github: String,
    twitter: String,
    portfolio: String,
    achievements: [
      {
        type: String
      }
    ],
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Skill'
      }
    ],
    referred_by: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    referral_code: {
      type: String,
      required: true,
      unique: true
    },
    user_role: {
      type: String,
      enum: ['admin', 'user', 'org_head'],
      default: 'user',
      required: true
    },
    resumes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resume'
      }
    ],
    default_resume_id: {
      type: String
    },
    onboarding_completed: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    versionKey: false,
    toObject: { virtuals: true }
  }
);

const User = model('User', userSchema);
export default User;

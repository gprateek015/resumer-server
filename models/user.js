import { Schema, model } from 'mongoose';

const profileLiskSchema = new Schema(
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

const skillSchema = new Schema(
  {
    skill: {
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    },
    proficiency: {
      type: String,
      required: true,
      enum: ['beginner', 'moderate', 'expert']
    }
  },
  { _id: 0 }
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
      required: true
    },
    profile_links: [profileLiskSchema],
    achievements: [
      {
        type: String
      }
    ],
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project'
      }
    ],
    experiences: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Experience'
      }
    ],
    skills: [skillSchema],
    educations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Education'
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
    resumes: {
      type: Schema.Types.ObjectId,
      ref: 'Resume'
    }
  },
  {
    toJSON: { virtuals: true },
    versionKey: false,
    toObject: { virtuals: true }
  }
);

userSchema.virtual('id').get(function () {
  return this._id;
});

userSchema.post(['find', 'findOne'], function (user, next) {
  // try to delete _id and hash_password fields
  next();
});

const User = model('User', userSchema);
export default User;

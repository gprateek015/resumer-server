import { Schema, model } from 'mongoose';
import User from './user.js';

const resumeSchema = new Schema(
  {
    filename: {
      type: String
    },
    data: {
      type: String,
      required: true
    },
    template_id: {
      type: Number,
      required: true
    },
    template_category: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

resumeSchema.post(
  ['findOneAndDelete', 'findByIdAndDelete'],
  async function (resume, next) {
    const user = await User.findById(resume.user_id);
    const resumes = user.resumes.filter(
      user_resume => user_resume.id !== resume.id
    );
    await User.findByIdAndUpdate(resume.user_id, { $set: { resumes } });
    next();
  }
);

const Resume = new model('Resume', resumeSchema);
export default Resume;

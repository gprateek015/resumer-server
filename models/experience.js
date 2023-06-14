import { Schema, model } from 'mongoose';
import User from './user.js';

const experienceSchema = new Schema(
  {
    company_name: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: false
    },
    description: [
      {
        type: String
      }
    ],
    mode: {
      type: String,
      required: true,
      enum: ['onsite', 'remote']
    },
    location: {
      type: String,
      required: false
    },
    user_id: {
      type: String,
      required: true
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

experienceSchema.post('findOneAndDelete', async function (experience, next) {
  const user = await User.findById(experience.user_id);
  user.experiences = user.experiences.filter(exp => {
    return exp.toString() !== experience.id.toString();
  });
  await user.save();
  next();
});

const Experience = model('Experience', experienceSchema);
export default Experience;

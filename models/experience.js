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
  { versionKey: false, toJSON: { virtuals: true } }
);

experienceSchema.post('findOneAndDelete', async function (experience, next) {
  const user = await User.findById(experience.user_id);
  user.experiences = user.experiences.filter(exp => {
    return exp.toString() !== experience._id.toString();
  });
  await user.save();
  next();
});

experienceSchema.virtual('id').get(function () {
  return this._id;
});

const Experience = model('Experience', experienceSchema);
export default Experience;

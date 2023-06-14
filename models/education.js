import { Schema, model } from 'mongoose';
import User from './user.js';

const educationSchema = new Schema(
  {
    level: {
      type: String,
      required: true,
      enum: [
        'lower_secondary',
        'senior_secondary',
        'diploma',
        'graduation',
        'post_graduation'
      ]
    },
    institute_name: {
      type: String,
      required: true
    },
    start_year: {
      type: Number,
      required: false
    },
    end_year: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    scoring_type: {
      type: String, // cgpa | percentage
      required: true
    },
    maximum_score: {
      type: Number,
      required: true
    },
    specialisation: {
      // required for levels senior_secondary | diploma | graduation |post_graduation
      type: String,
      required: false
    },
    user_id: {
      type: String,
      required: true
    }
  },
  {
    versionKey: 0,
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

educationSchema.post('findOneAndDelete', async function (education, next) {
  const user = await User.findById(education.user_id);
  user.educations = user.educations.filter(exp => {
    return exp.toString() !== education.id.toString();
  });
  await user.save();
  next();
});

const Education = model('Education', educationSchema);
export default Education;

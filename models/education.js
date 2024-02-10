import { Schema, model } from 'mongoose';
import User from './user.js';

const educationSchema = new Schema(
  {
    level: {
      type: String,
      required: false, // Should be true
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
      type: String,
      required: true,
      enum: ['cgpa', 'percentage']
    },
    maximum_score: {
      type: Number,
      required: true
    },
    specialisation: {
      // required for levels senior_secondary | diploma | graduation | post_graduation
      type: String,
      required: false
    },
    degree: {
      // required for levels graduation | post_graduation
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
      virtuals: true
    }
  }
);

educationSchema.post('findOneAndDelete', async function (education, next) {
  if (education) {
    const user = await User.findById(education.user_id);
    user.educations = user.educations.filter(exp => {
      return exp.toString() !== education._id.toString();
    });
    await user.save();
  }
  next();
});

const Education = model('Education', educationSchema);
export default Education;

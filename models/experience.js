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
      type: String,
      required: true
    },
    end_date: {
      type: String,
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
      enum: ['onsite', 'remote', 'hybrid']
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
      virtuals: true
    }
  }
);

const Experience = model('Experience', experienceSchema);
export default Experience;

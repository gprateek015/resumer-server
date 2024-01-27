import { Schema, model } from 'mongoose';
import User from './user.js';

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    skills_required: [
      {
        type: String
      }
    ],
    description: [
      {
        type: String
      }
    ],
    code_url: String,
    live_url: String,
    video_url: String,
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

projectSchema.post('findOneAndDelete', async function (project, next) {
  const user = await User.findById(project.user_id);
  user.projects = user.projects.filter(exp => {
    return exp.toString() !== project._id.toString();
  });
  await user.save();
  next();
});

const Project = model('Project', projectSchema);
export default Project;

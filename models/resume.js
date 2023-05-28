import { Schema, model } from 'mongoose';
import User from './user.js';

const resumeSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

resumeSchema.post('findOneAndDelete', async function (resume, next) {
  const user = await User.findById(resume.user_id).populate('resumes');
  const resumes = user.resumes.filter(
    user_resume => user_resume.id !== resume._id
  );
  await User.findByIdAndUpdate(resume.user_id, { $set: { resumes } });
  next();
});

const Resume = new model('Resume', resumeSchema);
export default Resume;

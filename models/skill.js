import { Schema, model } from 'mongoose';
import User from './user.js';

const skillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      required: true,
      enum: ['technical_skills', 'dev_tools', 'core_subjects', 'languages']
    }
  },
  { versionKey: 0, toJSON: { virtuals: true } }
);

skillSchema.post('findOneAndDelete', async function (skill, next) {
  const user = await User.findById(skill.user_id);
  user.skills = user.skills.filter(exp => {
    return exp.toString() !== skill._id.toString();
  });
  await user.save();
  next();
});

skillSchema.virtual('id').get(function () {
  return this._id;
});

const Skill = model('Skill', skillSchema);
export default Skill;

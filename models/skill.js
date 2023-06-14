import { Schema, model } from 'mongoose';

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

const Skill = model('Skill', skillSchema);
export default Skill;

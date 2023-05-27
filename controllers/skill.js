import Skill from '../models/skill.js';
import ExpressError from '../utilities/expressError.js';

export const addNewSkill = async (req, res) => {
  const user_id = req.user._id;
  const user = req.user;

  const newSkill = new Skill({ ...req.body, user_id });
  user.skills.push(newSkill);

  await newSkill.save();
  await user.save();

  res.status(200).send({
    success: true,
    skill: newSkill
  });
};

export const deleteSkill = async (req, res) => {
  const skill_id = req.body.skill_id;
  await Skill.findOneAndDelete({ _id: skill_id });

  res.status(200).send({
    success: true
  });
};

export const updateSkill = async (req, res) => {
  const skill = await Skill.findOneAndUpdate(
    { _id: req.body._id },
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.status(200).send({
    success: true,
    skill: { ...skill.toJSON() }
  });
};

export const getSkills = async (req, res) => {
  const { query, page_no = 1 } = req.query;

  if (page_no <= 0) {
    throw new ExpressError('Page number should be greater than 0', 400);
  }
  const skills = await Skill.find({ name: new RegExp(query, 'i') });

  const skillToSend = skills
    .slice((parseInt(page_no) - 1) * 10, parseInt(page_no) * 10)
    .map(skill => {
      const s = skill.toJSON();
      delete s._id;
      return s;
    });
  res.status(200).send(skillToSend);
};

export default {
  addNewSkill,
  deleteSkill,
  updateSkill
};

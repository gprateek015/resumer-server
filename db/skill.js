import Skill from '../models/skill.js';

export const getSkillsDB = async ({ query, page_no, limit = 10 }) => {
  return await Skill.find({ name: new RegExp(query, 'i') })
    .skip((parseInt(page_no) - 1) * limit)
    .limit(limit)
    .lean();

  // return await Skill.find({ name: new RegExp(query, 'i') });
};

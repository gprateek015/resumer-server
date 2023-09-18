import Skill from '../models/skill.js';

export const getSkillsDB = async ({ query }) => {
  return await Skill.find({ name: new RegExp(query, 'i') });
};

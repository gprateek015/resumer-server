import { getSkillsDB } from '../db/skill.js';
import ExpressError from '../utilities/express-error.js';

export const getSkills = async (req, res) => {
  const { query, page_no = 1 } = req.query;

  if (page_no <= 0) {
    throw new ExpressError('Page number should be greater than 0', 400);
  }
  const skills = await getSkillsDB({ query, page_no });

  res.status(200).send(skills);
};

export default {
  getSkills
};

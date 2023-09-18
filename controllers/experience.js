import {
  addNewExperienceDB,
  deleteExperienceDB,
  updateExperienceDB
} from '../db/experience.js';

export const addNewExperience = async (req, res) => {
  const user = req.user;
  const { company_name, position, start_date, end_date, description, mode } =
    req.body;

  const newExperience = await addNewExperienceDB({
    company_name,
    position,
    start_date,
    end_date,
    description,
    mode,
    user
  });

  res.status(200).send({
    success: true,
    experience: newExperience
  });
};

export const deleteExperience = async (req, res) => {
  const { experience_id } = req.params;
  const { user } = req;
  await deleteExperienceDB({ experience_id, user_id: user.id });

  res.status(200).send({
    success: true
  });
};

export const updateExperience = async (req, res) => {
  const { experience_id } = req.params;
  const { company_name, position, start_date, end_date, description, mode } =
    req.body;
  const { user } = req;

  const experience = await updateExperienceDB({
    company_name,
    position,
    start_date,
    end_date,
    description,
    mode,
    experience_id,
    user_id: user.id
  });

  res.status(200).send({
    success: true,
    experience: { ...experience.toJSON() }
  });
};

export default {
  addNewExperience,
  deleteExperience,
  updateExperience
};

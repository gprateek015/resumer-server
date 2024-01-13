import {
  addNewExperienceDB,
  deleteExperienceDB,
  fetchExperiencesFromDB,
  updateExperienceDB
} from '../db/experience.js';

export const fetchExperiences = async (req, res) => {
  const experiences = await fetchExperiencesFromDB(req.user);
  res.status(200).send({
    success: true,
    experiences
  });
};

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
    success: true
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
  const {
    company_name,
    position,
    start_date,
    end_date,
    description,
    mode,
    location
  } = req.body;
  const { user } = req;

  const experience = await updateExperienceDB({
    company_name,
    position,
    start_date,
    end_date,
    description,
    mode,
    location,
    experience_id,
    user_id: user.id
  });

  res.status(200).send({
    success: true
  });
};

export default {
  addNewExperience,
  deleteExperience,
  updateExperience
};

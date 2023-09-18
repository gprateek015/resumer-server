import {
  addNewEducationDB,
  deleteEducationDB,
  updateEducationDB
} from '../db/education.js';

export const addNewEducation = async (req, res) => {
  const { user } = req;
  const {
    level,
    institute_name,
    start_year,
    end_year,
    score,
    specialisation,
    maximum_score,
    scoring_type
  } = req.body;

  const newEducation = await addNewEducationDB({
    user,
    level,
    institute_name,
    start_year,
    end_year,
    score,
    specialisation,
    maximum_score,
    scoring_type
  });

  res.status(200).send({
    success: true,
    experience: newEducation
  });
};

export const deleteEducation = async (req, res) => {
  const { education_id } = req.params;
  const { user } = req;

  await deleteEducationDB({ education_id, user_id: user.id });

  res.status(200).send({
    success: true
  });
};

export const updateEducation = async (req, res) => {
  const { education_id } = req.params;
  const {
    level,
    institute_name,
    start_year,
    end_year,
    score,
    specialisation,
    maximum_score,
    scoring_type
  } = req.body;
  const { user } = req;

  const education = await updateEducationDB({
    level,
    institute_name,
    start_year,
    end_year,
    score,
    specialisation,
    maximum_score,
    scoring_type,
    education_id,
    user_id: user.id
  });

  res.status(200).send({
    success: true,
    education: { ...education.toJSON() }
  });
};

export default {
  addNewEducation,
  deleteEducation,
  updateEducation
};

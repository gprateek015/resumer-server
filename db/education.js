import Education from "../models/education.js";

export const fetchEducationsFromDB = async (user) => {
  const educations = await Education.find({ user: user._id });
  return educations;
};

export const addNewEducationDB = async ({
  user,
  level,
  institute_name,
  start_year,
  end_year,
  score,
  specialisation,
  maximum_score,
  scoring_type,
  degree,
}) => {
  const newEducation = new Education({
    user: user,
    level,
    institute_name,
    start_year,
    end_year,
    score,
    specialisation,
    maximum_score,
    scoring_type,
    degree,
  });

  await newEducation.save();

  return newEducation;
};

export const deleteEducationDB = async ({ education_id, user_id }) => {
  await Education.findOneAndDelete({
    $and: [{ _id: education_id }, { user: user_id }],
  });
};

export const updateEducationDB = async ({
  level,
  institute_name,
  start_year,
  end_year,
  score,
  specialisation,
  maximum_score,
  scoring_type,
  education_id,
  user_id,
  degree,
}) => {
  const education = await Education.findOneAndUpdate(
    { $and: [{ _id: education_id }, { user: user_id }] },
    {
      level,
      institute_name,
      start_year,
      end_year,
      score,
      specialisation,
      maximum_score,
      scoring_type,
      degree,
    },
    { new: true, runValidators: true }
  );
  return education;
};

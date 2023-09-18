import Education from '../models/education.js';

export const addNewEducationDB = async ({
  user,
  level,
  institute_name,
  start_year,
  end_year,
  score,
  specialisation,
  maximum_score,
  scoring_type
}) => {
  const newEducation = new Education({
    user_id: user.id,
    level,
    institute_name,
    start_year,
    end_year,
    score,
    specialisation,
    maximum_score,
    scoring_type
  });

  await newEducation.save();
  user.educations.push(newEducation);
  await user.save();

  return newEducation;
};

export const deleteEducationDB = async ({ education_id, user_id }) => {
  await Education.findOneAndDelete({
    $and: [{ _id: education_id }, { user_id }]
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
  user_id
}) => {
  const education = await Education.findOneAndUpdate(
    { $and: [{ _id: education_id }, { user_id }] },
    {
      level,
      institute_name,
      start_year,
      end_year,
      score,
      specialisation,
      maximum_score,
      scoring_type
    },
    { new: true, runValidators: true }
  );
  return education;
};

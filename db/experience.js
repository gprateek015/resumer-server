import Experience from '../models/experience.js';
import User from '../models/user.js';

export const fetchExperiencesFromDB = async user => {
  const { experiences } = await User.findById(user.id).populate('experiences');
  return experiences;
};

export const addNewExperienceDB = async ({
  company_name,
  position,
  start_date,
  end_date,
  description,
  mode,
  user
}) => {
  const newExperience = new Experience({
    company_name,
    position,
    start_date,
    end_date,
    description,
    mode,
    user_id: user.id
  });
  user.experiences.push(newExperience);

  await newExperience.save();
  await user.save();
  return newExperience;
};

export const deleteExperienceDB = async ({ experience_id, user_id }) => {
  await Experience.findOneAndDelete({
    $and: [{ _id: experience_id }, { user_id }]
  });
};

export const updateExperienceDB = async ({
  experience_id,
  company_name,
  position,
  start_date,
  end_date,
  description,
  location,
  mode,
  user_id
}) => {
  return await Experience.findOneAndUpdate(
    { $and: [{ _id: experience_id }, { user_id }] },
    {
      company_name,
      position,
      start_date,
      end_date,
      description,
      mode,
      location
    },
    { new: true, runValidators: true }
  );
};

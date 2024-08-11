import Experience from "../models/experience.js";
import UserProfile from "../models/user-profile.js";

export const fetchExperiencesFromDB = async (user) => {
  const experiences = await Experience.find({ user: user._id });
  return experiences;
};

export const addNewExperienceDB = async ({
  company_name,
  position,
  start_date,
  end_date,
  description,
  mode,
  user,
  location,
}) => {
  const newExperience = new Experience({
    company_name,
    position,
    start_date,
    end_date,
    description,
    mode,
    user: user,
    location,
  });

  await newExperience.save();
  return newExperience;
};

export const deleteExperienceDB = async ({ experience_id, user_id }) => {
  await Experience.findOneAndDelete({
    $and: [{ _id: experience_id }, { user: user_id }],
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
  user_id,
}) => {
  return await Experience.findOneAndUpdate(
    { $and: [{ _id: experience_id }, { user: user_id }] },
    {
      company_name,
      position,
      start_date,
      end_date,
      description,
      mode,
      location,
    },
    { new: true, runValidators: true }
  );
};

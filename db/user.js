import User from '../models/user.js';

export const registerUserDB = async ({
  name,
  email,
  username,
  hash_password,
  referral_code,
  referred_by
}) => {
  const newUser = new User({
    name,
    email,
    username,
    hash_password,
    referral_code,
    referred_by
  });

  return {
    ...newUser.toJSON(),
    educations: undefined,
    experiences: undefined,
    projects: undefined
  };
};

export const fetchSelfDB = async ({ user_id, email, username }) => {
  const user = await User.findOne({
    $or: [{ _id: user_id }, { email }, { username }]
  }).populate('skills');

  return {
    ...user.toJSON(),
    educations: undefined,
    experiences: undefined,
    projects: undefined
  };
};

export const updateUserDB = async ({
  user_id,
  name,
  city,
  state,
  phone,
  gender,
  achievements,
  profile_links,
  skills,
  linkedin,
  github,
  twitter,
  portfolio,
  onboarding_completed
}) => {
  const updateFields = {
    ...(city && { city }),
    ...(name && { name }),
    ...(state && { state }),
    ...(phone && { phone }),
    ...(gender && { gender }),
    ...(achievements && { achievements }),
    ...(profile_links && { profile_links }),
    ...(skills?.length && { skills }),
    ...(linkedin && { linkedin }),
    ...(github && { github }),
    ...(twitter && { twitter }),
    ...(portfolio && { portfolio }),
    ...(onboarding_completed && { onboarding_completed })
  };

  const user = await User.findOneAndUpdate({ _id: user_id }, updateFields, {
    runValidators: true
  });

  return user;
};

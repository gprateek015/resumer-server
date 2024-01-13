import User from '../models/user.js';

export const registerUserDB = async ({
  name,
  email,
  password,
  username,
  city,
  state,
  phone,
  gender,
  achievements,
  hash_password,
  skills,
  referral_code,
  referred_by,
  profile_links,
  linkedin,
  github,
  twitter,
  portfolio
}) => {
  const newUser = new User({
    name,
    email,
    password,
    username,
    city,
    state,
    phone,
    gender,
    achievements,
    hash_password,
    skills,
    referral_code,
    referred_by,
    profile_links,
    linkedin,
    github,
    twitter,
    portfolio
  });

  return newUser;
};

export const fetchSelfDB = async ({ user_id, email, username }) => {
  const user = await User.findOne({
    $or: [{ _id: user_id }, { email }, { username }]
  }).populate(['experiences', 'educations', 'skills.skill', 'projects']);

  return user;
};

export const updateUserDB = async ({
  user_id,
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
  const user = await User.findOneAndUpdate(
    { _id: user_id },
    {
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
    },
    { new: true, runValidators: true }
  ).populate(['experiences', 'educations', 'skills.skill', 'projects']);

  return user;
};

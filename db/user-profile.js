import UserProfile from "../models/user-profile.js";
import ExpressError from "../utilities/express-error.js";

export const registerUserProfileDB = async ({
  user_id,
  name,
  email,
  username,
  referral_code,
  referred_by,
  r_coins,
}) => {
  const newUserProfile = new UserProfile({
    user_id,
    name,
    email,
    username,
    referral_code,
    referred_by,
    r_coins,
  });

  if (!newUserProfile) {
    throw new ExpressError("UserProfile couldn't be registered", 500);
  }
  await newUserProfile?.save();

  return {
    ...newUserProfile?.toJSON(),
    educations: undefined,
    experiences: undefined,
    projects: undefined,
  };
};

export const fetchSelfDB = async ({ user_id, email, username }) => {
  const user = await UserProfile.findOne({
    $or: [{ _id: user_id }, { email }, { username }],
  }).populate("skills");

  if (!user) {
    throw new ExpressError("User does not exist", 404);
  }

  return {
    ...user?.toJSON(),
    educations: undefined,
    experiences: undefined,
    projects: undefined,
  };
};

export const updateUserProfileDB = async ({
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
  onboarding_completed,
  certificates,
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
    ...(onboarding_completed && { onboarding_completed }),
    ...(certificates && { certificates }),
  };

  const user = await UserProfile.findOneAndUpdate(
    { _id: user_id },
    updateFields,
    {
      runValidators: true,
    }
  );

  return user;
};

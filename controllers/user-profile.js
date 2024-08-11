import referralCodeGenerator from "referral-code-generator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserProfile from "../models/user-profile.js";
import ExpressError from "../utilities/express-error.js";

import {
  fetchSelfDB,
  registerUserProfileDB,
  updateUserProfileDB,
} from "../db/user-profile.js";
import {
  findOrMakeSkills,
  formatSkills,
  generateNewUserProfilename,
} from "../utilities/index.js";
import OTP from "../models/otp.js";
import { addNewExperienceDB } from "../db/experience.js";
import { addNewProjectDB } from "../db/project.js";
import { addNewEducationDB } from "../db/education.js";
import Education from "../models/education.js";
import Project from "../models/project.js";
import Experience from "../models/experience.js";
import User from "../models/user.js";

export const registerUserProfile = async (req, res) => {
  if (!req.body.username) {
    req.body.username = await generateNewUserProfilename({
      email: req.body.email,
    });
  }

  const { name, email, password, username } = req.body;

  const otp = await OTP.findOne({ email });
  if (!otp?.verified) {
    throw new ExpressError("Email is not verified", 400);
  }

  const saltRounds = 10;
  const hash_password = await bcrypt.hash(password, saltRounds);

  let referred_by = null;
  if (req.body.invite_code) {
    referred_by = await UserProfile.findOne({
      referral_code: req.body.invite_code,
    });
  }

  const referral_code = referralCodeGenerator.alphaNumeric("lowercase", 4, 3);

  const newUser = new User({
    email,
    name,
    password: hash_password,
  });
  await newUser.save();

  await registerUserProfileDB({
    user_id: newUser._id,
    name,
    email,
    username,
    hash_password,
    referral_code,
    referred_by,
    r_coins: process.env.TOTAL_RCOIN_TO_GIVE,
  });

  res.status(200).send({
    success: true,
  });
};

export const fetchSelf = async (req, res) => {
  const { user } = req;
  const userData = await fetchSelfDB({ user_id: user._id });

  const skills = formatSkills(userData.skills);

  res.status(200).send({
    success: true,
    user: { ...userData, skills },
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && user.password) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.status(200).send({
        success: true,
        ...user.toJSON(),
      });
      return;
    }
  } else if (user && !user.password)
    throw new ExpressError("Please login using social handles", 400);
  throw new ExpressError("email and password doesn't match", 400);
};

export const updateUserProfile = async (req, res) => {
  const user_id = req.user._id;
  const {
    name,
    city,
    state,
    phone,
    gender,
    achievements,
    profile_links,
    linkedin,
    github,
    twitter,
    portfolio,
    onboarding_completed,
    experiences = [],
    projects = [],
    educations = [],
    certificates = [],
  } = req.body;

  const skills = await findOrMakeSkills(req.body.skills);

  if (onboarding_completed) {
    await Education.deleteMany({ user: user_id });
    await Project.deleteMany({ user: user_id });
    await Experience.deleteMany({ user: user_id });
  }

  for (let exp of experiences) {
    await addNewExperienceDB({ ...exp, user: req.user });
  }
  for (let project of projects) {
    await addNewProjectDB({ ...project, user: req.user });
  }
  for (let edu of educations) {
    await addNewEducationDB({ ...edu, user: req.user });
  }

  const user = await updateUserProfileDB({
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
  });

  if (!user) {
    throw new ExpressError("UserProfile not found", 401);
  }

  res.status(200).send({
    success: true,
  });
};

export const getPublicProfile = async (req, res) => {
  const { username } = req.params;
  const userData = await fetchSelfDB({ username });

  res.status(200).send({
    success: true,
    user: {
      ...userData,
      skills: formatSkills(userData.skills),
      hash_password: undefined,
      referral_code: undefined,
      referred_by: undefined,
      user_role: undefined,
    },
  });
};

export default {
  registerUserProfile,
  fetchSelf,
  loginUser,
  updateUserProfile,
};

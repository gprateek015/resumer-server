import referralCodeGenerator from 'referral-code-generator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user.js';
import ExpressError from '../utilities/express-error.js';

import { fetchSelfDB, registerUserDB, updateUserDB } from '../db/user.js';
import {
  findOrMakeSkills,
  formatSkills,
  generateNewUsername
} from '../utilities/index.js';

export const registerUser = async (req, res) => {
  if (!req.body.username) {
    req.body.username = await generateNewUsername({ email: req.body.email });
  }

  const { name, email, password, username } = req.body;
  const saltRounds = 10;
  const hash_password = await bcrypt.hash(password, saltRounds);

  let referred_by = null;
  if (req.body.invite_code) {
    referred_by = await User.findOne({ referral_code: req.body.invite_code });
  }

  const referral_code = referralCodeGenerator.alphaNumeric('lowercase', 4, 3);

  const newUser = await registerUserDB({
    name,
    email,
    username,
    hash_password,
    referral_code,
    referred_by
  });

  const json_secret_key = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(newUser._id.toString(), json_secret_key);

  await newUser.save();

  if (!newUser) {
    throw new ExpressError("User couldn't be registered", 500);
  }

  res.status(200).send({
    success: true,
    token,
    user: {
      ...newUser,
      skills: formatSkills(newUser.skills),
      hash_password: undefined,
      resumes: undefined
    }
  });
};

export const socialLogin = async (req, res) => {
  const { name, email } = req.body;

  let user = await fetchSelfDB({ email });

  if (!user) {
    let referred_by = null;
    if (req.body.invite_code) {
      referred_by = await User.findOne({ referral_code: req.body.invite_code });
    }

    const referral_code = referralCodeGenerator.alphaNumeric('lowercase', 4, 3);

    if (!req.body.username) {
      req.body.username = await generateNewUsername({ email: req.body.email });
    }

    const newUser = await registerUserDB({
      name,
      email,
      username: req.body.username,
      referral_code,
      referred_by
    });
    await newUser.save();

    user = newUser;
  }

  const json_secret_key = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(user._id.toString(), json_secret_key);

  if (!user) {
    throw new ExpressError("User couldn't be registered", 500);
  }

  res.status(200).send({
    success: true,
    token,
    user: {
      ...user,
      skills: formatSkills(user.skills),
      hash_password: undefined
    }
  });
};

export const fetchSelf = async (req, res) => {
  const { user } = req;
  const userData = await fetchSelfDB({ user_id: user._id });
  if (!userData) {
    throw new ExpressError('User not found', 401);
  }

  const skills = formatSkills(userData.skills);

  res.status(200).send({
    success: true,
    user: { ...userData, skills, hash_password: undefined }
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await fetchSelfDB({ email });
  if (user) {
    const match = await bcrypt.compare(password, user.hash_password);
    if (match) {
      const json_secret_key = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(user._id.toString(), json_secret_key);

      res.status(200).send({
        success: true,
        user: {
          ...user,
          skills: formatSkills(user.skills),
          hash_password: undefined
        },
        token
      });
      return;
    }
  }
  throw new ExpressError("email and password doesn't match", 400);
};

export const updateUser = async (req, res) => {
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
    onboarding_completed
  } = req.body;

  const skills = await findOrMakeSkills(req.body.skills);

  const user = await updateUserDB({
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
  });

  if (!user) {
    throw new ExpressError('User not found', 401);
  }

  res.status(200).send({
    success: true
  });
};

export const getPublicProfile = async (req, res) => {
  const { username } = req.params;
  const user = await fetchSelfDB({ username });

  if (!user) {
    throw new ExpressError('User not found', 401);
  }

  res.status(200).send({
    success: true,
    user: {
      ...user,
      skills: formatSkills(user.skills),
      resumes: [
        user?.resumes?.find(resume => resume === user.default_resume_id) ||
          user.resumes?.[0]
      ],
      hash_password: undefined,
      referral_code: undefined,
      referred_by: undefined,
      user_role: undefined
    }
  });
};

export default {
  registerUser,
  fetchSelf,
  loginUser,
  updateUser
};

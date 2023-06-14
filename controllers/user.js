import referralCodeGenerator from 'referral-code-generator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateFromEmail, generateUsername } from 'unique-username-generator';
import latex from 'node-latex';

import User from '../models/user.js';
import ExpressError from '../utilities/express-error.js';
import Skill from '../models/skill.js';
import templates from '../resume/index.js';

const findOrMakeSkills = (data = []) => {
  return Promise.all(
    data.map(async skill => {
      let sk = null;
      if (skill?.id) {
        sk = await Skill.findById(skill.id);
        if (!sk) {
          throw new ExpressError(
            'Skill Id is invalid. Please add a new skill!'
          );
        }
      } else {
        try {
          sk = new Skill({ name: skill.name, type: skill.type });
          await sk.save();
        } catch (err) {
          // Skill with same name already exists
          sk = await Skill.findOne({ name: skill.name });
        }
      }
      return {
        skill: sk,
        proficiency: skill.proficiency
      };
    })
  );
};

const formatSkills = (skills = []) =>
  skills.map(skill => ({
    proficiency: skill.proficiency,
    name: skill.skill.name,
    id: skill.skill.id
  }));

export const registerUser = async (req, res) => {
  const saltRounds = 10;
  const hash_password = await bcrypt.hash(req.body.password, saltRounds);

  if (!req.body.username) {
    let username = generateFromEmail(req.body.email, 3);
    const user = await User.findOne({ username });
    if (user) {
      username = generateUsername();
    }
    req.body.username = username;
  }

  let referred_by = null;
  if (req.body.invite_code) {
    referred_by = await User.findOne({ referral_code: req.body.invite_code });
  }

  const skills = await findOrMakeSkills(req.body.skills);

  let referral_code,
    tries = 10;

  while (tries) {
    const code = referralCodeGenerator.alphaNumeric('lowercase', 4, 3);
    const user = await User.find({ referral_code: code });
    referral_code = code;
    if (!user) break;
    if (tries === 0) {
      res.status(500).send('Maximum users limit is reached!');
      return;
    } else {
      tries -= 1;
    }
  }

  const newUser = new User({
    ...req.body,
    hash_password,
    skills,
    referral_code,
    referred_by
  });

  const json_secret_key = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(newUser.id.toString(), json_secret_key);

  await newUser.save();

  if (!newUser) {
    throw new ExpressError("User couldn't be registered", 500);
  }

  const finalSkills = formatSkills(newUser.skills);

  res.status(200).send({
    success: true,
    user: {
      ...newUser.toJSON(),
      skills: finalSkills,
      hash_password: undefined,
      resumes: undefined
    },
    token
  });
};

export const fetchSelf = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ExpressError('User not found', 401);
  }
  const skills = formatSkills(user.skills);

  res.status(200).send({
    success: true,
    user: { ...user.toJSON(), skills, resumes: undefined }
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const match = await bcrypt.compare(password, user.hash_password);
    if (match) {
      const json_secret_key = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(user.id, json_secret_key);

      const skills = formatSkills(user.skills);

      res.status(200).send({
        success: true,
        user: {
          ...user.toJSON(),
          skills,
          hash_password: undefined,
          resumes: undefined
        },
        token
      });
    }
  } else {
    throw new ExpressError("email and password doesn't match", 400);
  }
};

export const updateUser = async (req, res) => {
  const user_id = req.user.id;

  const skills = await findOrMakeSkills(req.body.skills);

  const user = await User.findOneAndUpdate(
    { _id: user_id },
    { ...req.body, skills },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ExpressError('User not found', 401);
  }

  const finalSkills = formatSkills(user.skills);

  res.status(200).send({
    success: true,
    user: {
      ...user.toJSON(),
      skills: finalSkills,
      hash_password: undefined,
      resumes: undefined
    }
  });
};

export default {
  registerUser,
  fetchSelf,
  loginUser,
  updateUser
};

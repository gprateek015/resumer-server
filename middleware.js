import * as jose from "jose";

import {
  userSchema,
  userUpdateSchema,
  userLoginSchema,
  educationSchema,
  educationDeleteSchema,
  educationUpdateSchema,
  experienceSchema,
  experienceDeleteSchema,
  skillSchema,
  skillDeleteSchema,
  skillUpdateSchema,
  projectSchema,
  projectDeleteSchema,
  projectUpdateSchema,
  experienceUpdateSchema,
} from "./schema.js";

import { generateNewUserProfilename } from "./utilities/index.js";
import { registerUserProfileDB } from "./db/user-profile.js";

import referralCodeGenerator from "referral-code-generator";

import User from "./models/user.js";
import UserProfile from "./models/user-profile.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authorization = req.cookies["next-auth.session-token"];
    if (!authorization) throw new Error();

    const json_secret_key = process.env.JWT_SECRET_KEY;
    const secret = new TextEncoder().encode(json_secret_key);
    const { payload } = await jose.jwtVerify(authorization, secret);

    const user = await User.findOne({ email: payload.email });
    if (!user) throw new Error();
    const userProfile = await UserProfile.findOne({ user_id: user._id });

    if (userProfile) {
      req.user = userProfile.toJSON();
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "User is not authenticated." });
  }
};

export const authenticateAndCreateUser = async (req, res, next) => {
  try {
    const authorization = req.cookies["next-auth.session-token"];
    if (!authorization) throw new Error("");

    const json_secret_key = process.env.JWT_SECRET_KEY;
    const secret = new TextEncoder().encode(json_secret_key);
    const { payload } = await jose.jwtVerify(authorization, secret);

    const user = await User.findOne({ email: payload.email });
    if (!user) throw new Error();
    const userProfile = await UserProfile.findOne({ user_id: user._id });

    if (userProfile) {
      req.user = userProfile.toJSON();
    } else {
      // When user is new
      const referral_code = referralCodeGenerator.alphaNumeric(
        "lowercase",
        4,
        3
      );
      const username = await generateNewUserProfilename({
        email: req.body.email,
      });

      const userData = await registerUserProfileDB({
        user_id: user._id,
        email: user.email,
        referral_code,
        name: user.name,
        username,
      });

      req.user = userData;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "User is not authenticated." });
  }
};

// ------------- UserProfile Validation Schema -------------
export const validateUserProfile = async (data) => {
  await userSchema.validateAsync(data, {
    abortEarly: false,
  });
};
export const validateUserProfileUpdate = async (data) => {
  await userUpdateSchema.validateAsync(data, {
    abortEarly: false,
  });
};
export const validateUserProfileLogin = async (data) => {
  await userLoginSchema.validateAsync(data, {
    abortEarly: false,
  });
};

// ------------- Education Validation Schema -------------
export const validateEducation = async (data) => {
  await educationSchema.validateAsync(data, {
    abortEarly: false,
  });
};
export const validateEducationDelete = async (data) => {
  await educationDeleteSchema.validateAsync(data, {
    abortEarly: false,
  });
};
export const validateEducationUpdate = async (data) => {
  await educationUpdateSchema.validateAsync(data, {
    abortEarly: false,
  });
};

// ------------- Experience Validation Schema -------------
export const validateExperience = async (data) => {
  await experienceSchema.validateAsync(data, {
    abortEarly: false,
  });
};
export const validateExperienceDelete = async (data) => {
  await experienceDeleteSchema.validateAsync(data, {
    abortEarly: false,
  });
};
export const validateExperienceUpdate = async (data) => {
  await experienceUpdateSchema.validateAsync(data, {
    abortEarly: false,
  });
};

// ------------- Skill Validation Schema -------------
export const validateSkill = async (data) => {
  await skillSchema.validateAsync(data, {
    abortEarly: false,
  });
};
export const validateSkillDelete = async (data) => {
  await skillDeleteSchema.validateAsync(data, {
    abortEarly: false,
  });
};
export const validateSkillUpdate = async (data) => {
  await skillUpdateSchema.validateAsync(data, {
    abortEarly: false,
  });
};

// ------------- Project Validation Schema -------------
export const validateProject = async (data) => {
  await projectSchema.validateAsync(data, {
    abortEarly: false,
  });
};
export const validateProjectDelete = async (data) => {
  await projectDeleteSchema.validateAsync(data, {
    abortEarly: false,
  });
};
export const validateProjectUpdate = async (data) => {
  await projectUpdateSchema.validateAsync(data, {
    abortEarly: false,
  });
};

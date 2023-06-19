import jwt from 'jsonwebtoken';

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
  experienceUpdateSchema
} from './schema.js';

import User from './models/user.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const json_secret_key = process.env.JWT_SECRET_KEY;
    const user_id = jwt.verify(token, json_secret_key);
    const user = await User.findById(user_id);
    if (user) {
      req.user = user;
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401).send({ error: 'User is not authenticated.' });
  }
};

// ------------- User Validation Schema -------------
export const validateUser = async data => {
  await userSchema.validateAsync(data, {
    abortEarly: false
  });
};
export const validateUserUpdate = async data => {
  await userUpdateSchema.validateAsync(data, {
    abortEarly: false
  });
};
export const validateUserLogin = async data => {
  await userLoginSchema.validateAsync(data, {
    abortEarly: false
  });
};

// ------------- Education Validation Schema -------------
export const validateEducation = async data => {
  await educationSchema.validateAsync(data, {
    abortEarly: false
  });
};
export const validateEducationDelete = async data => {
  await educationDeleteSchema.validateAsync(data, {
    abortEarly: false
  });
};
export const validateEducationUpdate = async data => {
  await educationUpdateSchema.validateAsync(data, {
    abortEarly: false
  });
};

// ------------- Experience Validation Schema -------------
export const validateExperience = async data => {
  await experienceSchema.validateAsync(data, {
    abortEarly: false
  });
};
export const validateExperienceDelete = async data => {
  await experienceDeleteSchema.validateAsync(data, {
    abortEarly: false
  });
};
export const validateExperienceUpdate = async data => {
  await experienceUpdateSchema.validateAsync(data, {
    abortEarly: false
  });
};

// ------------- Skill Validation Schema -------------
export const validateSkill = async data => {
  await skillSchema.validateAsync(data, {
    abortEarly: false
  });
};
export const validateSkillDelete = async data => {
  await skillDeleteSchema.validateAsync(data, {
    abortEarly: false
  });
};
export const validateSkillUpdate = async data => {
  await skillUpdateSchema.validateAsync(data, {
    abortEarly: false
  });
};

// ------------- Project Validation Schema -------------
export const validateProject = async data => {
  await projectSchema.validateAsync(data, {
    abortEarly: false
  });
};
export const validateProjectDelete = async data => {
  await projectDeleteSchema.validateAsync(data, {
    abortEarly: false
  });
};
export const validateProjectUpdate = async data => {
  await projectUpdateSchema.validateAsync(data, {
    abortEarly: false
  });
};

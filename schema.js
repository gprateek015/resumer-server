import Joi from 'joi';
import User from './models/user.js';
import ExpressError from './utilities/express-error.js';

const uniqueEmail = async email => {
  const user = await User.findOne({ email });
  if (user) {
    throw new ExpressError(
      'The email is already registered. Please Login!',
      401
    );
  }
};
const uniqueUsername = async username => {
  const user = await User.findOne({ username });
  if (user) {
    throw new ExpressError(
      'The username is already registered. Please try with another username!',
      401
    );
  }
};

// ------------ User Schemas ------------
export const userSchema = Joi.object({
  email: Joi.string().email().required().external(uniqueEmail),
  username: Joi.string().external(uniqueUsername),
  name: Joi.string().required(),
  city: Joi.string(),
  state: Joi.string(),
  phone: Joi.string(),
  gender: Joi.string().valid('male', 'female', 'other'),
  password: Joi.string().min(6).required(),
  profile_links: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      link: Joi.string().required()
    })
  ),
  certificates: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      link: Joi.string().required()
    })
  ),
  achievements: Joi.array().items(Joi.string()),
  skills: Joi.array().items(
    Joi.object({
      id: Joi.string().optional(),
      name: Joi.string(),
      type: Joi.string()
        .valid('technical_skills', 'dev_tools', 'core_subjects', 'languages')
        .required()
    })
  ),
  invite_code: Joi.string(),
  linkedin: Joi.string().allow('').optional(),
  github: Joi.string().allow('').optional(),
  twitter: Joi.string().allow('').optional(),
  portfolio: Joi.string().allow('').optional()
});

export const userUpdateSchema = Joi.object({
  name: Joi.string(),
  gender: Joi.string().valid('male', 'female', 'other'),
  username: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  phone: Joi.string(),
  password: Joi.string().min(6),
  profile_links: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      link: Joi.string()
    })
  ),
  certificates: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      link: Joi.string().required()
    })
  ),
  achievements: Joi.array().items(Joi.string()),
  skills: Joi.array().items(
    Joi.object({
      id: Joi.string().optional(),
      name: Joi.string(),
      type: Joi.string()
        .valid('technical_skills', 'dev_tools', 'core_subjects', 'languages')
        .required()
    })
  ),
  linkedin: Joi.string().allow('').optional(),
  github: Joi.string().allow('').optional(),
  twitter: Joi.string().allow('').optional(),
  portfolio: Joi.string().allow('').optional(),
  onboarding_completed: Joi.bool().optional(),
  experiences: Joi.array(),
  projects: Joi.array(),
  educations: Joi.array()
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
export const userSocialLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().optional()
});

// ------------ Education Schemas ------------
export const educationSchema = Joi.object({
  level: Joi.string()
    .valid(
      'lower_secondary',
      'senior_secondary',
      'diploma',
      'graduation',
      'post_graduation'
    )
    .required(),
  institute_name: Joi.string().required(),
  start_year: Joi.number().min(1900).max(new Date().getFullYear()),
  end_year: Joi.number()
    .min(1900)
    .max(new Date().getFullYear() + 10)
    .greater(Joi.ref('start_year'))
    .required(),
  score: Joi.number().min(0).max(100).required(),
  specialisation: Joi.string().optional().allow(''),
  maximum_score: Joi.number().required(),
  scoring_type: Joi.string().required(),
  degree: Joi.string().optional().allow('')
});
export const educationUpdateSchema = Joi.object({
  level: Joi.string().valid(
    'lower_secondary',
    'senior_secondary',
    'diploma',
    'graduation',
    'post_graduation'
  ),
  institute_name: Joi.string(),
  start_year: Joi.number().min(1900).max(new Date().getFullYear()),
  end_year: Joi.number()
    .min(1900)
    .max(new Date().getFullYear() + 10)
    .greater(Joi.ref('start_year')),
  score: Joi.number().min(0).max(100),
  specialisation: Joi.string().allow(''),
  maximum_score: Joi.number().required(),
  scoring_type: Joi.string().required(),
  degree: Joi.string().required().allow('')
});
export const educationDeleteSchema = Joi.object({});

// ------------ Experience Schemas ------------
export const experienceSchema = Joi.object({
  company_name: Joi.string().required(),
  position: Joi.string().required(),
  start_date: Joi.date().min('1-1-1900').max(new Date()).iso().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).max(new Date()).iso(),
  description: Joi.array().items(Joi.string()),
  mode: Joi.string().valid('onsite', 'remote').required(),
  location: Joi.string()
});
export const experienceUpdateSchema = Joi.object({
  company_name: Joi.string(),
  position: Joi.string(),
  start_date: Joi.date().min('1-1-1900').max(new Date()).iso(),
  end_date: Joi.date().greater(Joi.ref('start_date')).max(new Date()).iso(),
  description: Joi.array().items(Joi.string()),
  mode: Joi.string().valid('onsite', 'remote'),
  location: Joi.string()
});
export const experienceDeleteSchema = Joi.object({});

// ------------ Project Schemas ------------
export const projectSchema = Joi.object({
  name: Joi.string().required(),
  skills_required: Joi.array().items(Joi.string()),
  description: Joi.array().items(Joi.string()),
  code_url: Joi.string().allow(''),
  live_url: Joi.string().allow(''),
  video_url: Joi.string().allow('')
});
export const projectUpdateSchema = Joi.object({
  name: Joi.string(),
  skills_required: Joi.array().items(Joi.string()),
  description: Joi.array().items(Joi.string()),
  code_url: Joi.string().allow(''),
  live_url: Joi.string().allow(''),
  video_url: Joi.string().allow('')
});
export const projectDeleteSchema = Joi.object({
  project_id: Joi.string().required()
});

// ------------ Skill Schemas ------------
export const skillSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string()
    .valid('technical_skills', 'dev_tools', 'core_subjects', 'languages')
    .required()
});
export const skillUpdateSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string()
});
export const skillDeleteSchema = Joi.object({
  skill_id: Joi.string().required()
});

export default {
  userSchema,
  educationSchema,
  experienceSchema,
  projectSchema,
  skillSchema
};

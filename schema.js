import Joi from 'joi';
import User from './models/user.js';

const uniqueEmail = async email => {
  const user = await User.findOne({ email });
  if (user) {
    const error = new Error('The email is already registered. Please Login!');
    error.name = 'email';
    throw error;
  }
};
const uniqueUsername = async username => {
  const user = await User.findOne({ username });
  if (user) {
    const error = new Error(
      'The username is already registered. Please try with another username!'
    );
    error.name = 'username';
    throw error;
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
  achievements: Joi.array().items(Joi.string()),
  skills: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      proficiency: Joi.string()
        .valid('beginner', 'moderate', 'expert')
        .required(),
      type: Joi.string()
        .valid('technical_skills', 'dev_tools', 'core_subjects', 'languages')
        .required()
    })
  ),
  invite_code: Joi.string()
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
  achievements: Joi.array().items(Joi.string()),
  skills: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      proficiency: Joi.string()
        .valid('beginner', 'moderate', 'expert')
        .required(),
      type: Joi.string()
        .valid('technical_skills', 'dev_tools', 'core_subjects', 'languages')
        .required()
    })
  )
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
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
  specialisation: Joi.string(),
  maximum_score: Joi.number().required(),
  scoring_type: Joi.string().required()
});
export const educationUpdateSchema = Joi.object({
  id: Joi.string().required(),
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
  specialisation: Joi.string()
});
export const educationDeleteSchema = Joi.object({
  education_id: Joi.string().required()
});

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
  id: Joi.string().required(),
  company_name: Joi.string(),
  position: Joi.string(),
  start_date: Joi.date().min('1-1-1900').max(new Date()).iso(),
  end_date: Joi.date().greater(Joi.ref('start_date')).max(new Date()).iso(),
  description: Joi.array().items(Joi.string()),
  mode: Joi.string().valid('onsite', 'remote'),
  location: Joi.string()
});
export const experienceDeleteSchema = Joi.object({
  experience_id: Joi.string().required()
});

// ------------ Project Schemas ------------
export const projectSchema = Joi.object({
  name: Joi.string().required(),
  skills_required: Joi.array().items(Joi.string()),
  description: Joi.array().items(Joi.string()),
  code_url: Joi.string(),
  live_url: Joi.string(),
  video_url: Joi.string()
});
export const projectUpdateSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
  skills_required: Joi.array().items(Joi.string()),
  description: Joi.array().items(Joi.string()),
  code_url: Joi.string(),
  live_url: Joi.string(),
  video_url: Joi.string()
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

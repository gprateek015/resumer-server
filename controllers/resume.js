import latex from 'node-latex';

import User from '../models/user.js';
import templates from '../resume/index.js';
import ExpressError from '../utilities/express-error.js';
import {
  rewriteAchievements,
  rewriteDescriptions,
  rewriteSentence
} from '../utilities/text-davinci.js';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const skillCompareFunction = (a, b) => {
  if (a.proficiency === b.proficiency) return 0;
  if (
    (a.proficiency === 'beginner' &&
      (b.proficiency === 'moderate' || b.proficiency === 'expert')) ||
    (a.proficiency === 'moderate' && b.proficiency === 'expert')
  ) {
    return 1;
  }
  return -1;
};

const getUserData = async user_id => {
  const user = await User.findById(user_id).populate([
    'experiences',
    'educations',
    'skills.skill',
    'projects'
  ]);

  const { name, city, state, phone, gender, email, achievements } = user;

  const educations = user.educations.map(education => {
    const new_edu = education.toJSON();
    switch (new_edu.level) {
      case 'lower_secondary': {
        new_edu.education_type = 'Lower Secondary';
        break;
      }
      case 'senior_secondary': {
        new_edu.education_type = `Senior Secondary in ${new_edu.specialisation}`;
        break;
      }
      case 'diploma': {
        new_edu.education_type = `Diploma in ${new_edu.specialisation}`;
        break;
      }
      case 'graduation': {
        new_edu.education_type = `Bachelors in ${new_edu.specialisation}`;
        break;
      }
      case 'post_graduation': {
        new_edu.education_type = `Post Graduation in ${new_edu.specialisation}`;
        break;
      }
      default:
        new_edu.education_type = 'Education level missing';
    }
    return new_edu;
  });

  const projects = user.projects.map(project => project.toJSON());

  const experiences = user.experiences.map(experience => {
    const start_date = new Date(experience.start_date);
    const end_date = experience.end_date && new Date(experience.end_date);
    const new_exp = {
      ...experience.toJSON(),
      start_date: `${months[start_date.getMonth()]} ${start_date.getFullYear()}`
    };
    if (end_date) {
      new_exp.end_date = `${
        months[end_date.getMonth()]
      } ${end_date.getFullYear()}`;
    }
    return new_exp;
  });

  const linkedin = user.profile_links.find(
    profile => profile.name.toLowerCase() === 'linkedin'
  )?.link;
  const github = user.profile_links.find(
    profile => profile.name.toLowerCase() === 'github'
  )?.link;

  const profile_links = user.profile_links.filter(
    profile =>
      profile.name.toLowerCase() !== 'linkedin' ||
      profile.name.toLowerCase() !== 'github'
  );

  const technical_skills = user.skills
    .filter(skill => skill.skill.type === 'technical_skills')
    .sort(skillCompareFunction)
    .map(skill => skill.skill.name);
  const dev_tools = user.skills
    .filter(skill => skill.skill.type === 'dev_tools')
    .sort(skillCompareFunction)
    .map(skill => skill.skill.name);
  const core_subjects = user.skills
    .filter(skill => skill.skill.type === 'core_subjects')
    .sort(skillCompareFunction)
    .map(skill => skill.skill.name);
  const languages = user.skills
    .filter(skill => skill.skill.type === 'languages')
    .sort(skillCompareFunction)
    .map(skill => skill.skill.name);

  return {
    name,
    city,
    state,
    phone,
    gender,
    email,
    achievements,
    projects,
    experiences,
    educations,
    linkedin,
    github,
    profile_links,
    technical_skills,
    dev_tools,
    core_subjects,
    languages
  };
};

export const getEngineeringResumeData = async (req, res) => {
  const user_id = req.user._id;
  const { template_id } = req.params;
  const { rewrite = false } = req.query;
  const userData = await getUserData(user_id);

  if (parseInt(template_id) >= Object.keys(templates).length)
    throw new ExpressError(
      `Template with id: ${template_id} does not exist`,
      404
    );

  if (rewrite === 'true') {
    userData.experiences = await Promise.all(
      userData.experiences.map(async experience => {
        experience.description = await rewriteDescriptions(
          experience.description
        );
        return experience;
      })
    );
    userData.projects = await Promise.all(
      userData.projects.map(async project => {
        project.description = await rewriteDescriptions(project.description);
        return project;
      })
    );
    // userData.achievements = await rewriteAchievements(userData.achievements);
    userData.achievements = await Promise.all(
      userData.achievements.map(
        async achievement => await rewriteSentence(achievement)
      )
    );
  }

  res.status(200).send(userData);
};

export const loadEngineeringResume = async (req, res) => {
  const { template_id } = req.params;

  if (
    parseInt(template_id) >=
    Object.keys(templates['engineeringTemplates']).length
  )
    throw new ExpressError(
      `Template with id: ${template_id} does not exist`,
      404
    );

  const resume = templates['engineeringTemplates'][template_id](req.body);
  const pdf = latex(resume);
  pdf.pipe(res);
};

export const rewriteStatement = async (req, res) => {
  const { statement } = req.body;
  const updatedStatement = await rewriteSentence(statement);
  res.status(200).send({
    success: true,
    statement: updatedStatement
  });
};

export const rewriteDescription = async (req, res) => {
  const { description } = req.body;
  const updatesDescription = await rewriteDescriptions(description);
  res.status(200).send({
    success: true,
    description: updatesDescription
  });
};

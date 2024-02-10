import Skill from '../models/skill.js';
import PDFParser from 'pdf2json';
import { generateFromEmail, generateUsername } from 'unique-username-generator';
import User from '../models/user.js';

export const skillCompareFunction = (a, b) => {
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

export const findOrMakeSkills = (data = []) => {
  return Promise.all(
    data.map(async skill => {
      let sk = null;
      if (skill?._id) {
        sk = await Skill.findById(skill._id);
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
      return sk;
    })
  );
};

export const updateEducationsForResume = (educations = []) =>
  educations.map(education => {
    const new_edu = education;
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

export const updateExperiencesForResume = (experiences = []) =>
  experiences.map(experience => {
    const start_date = new Date(experience.start_date);
    const end_date = experience.end_date && new Date(experience.end_date);
    const new_exp = {
      ...experience,
      start_date: `${months[start_date.getMonth()]} ${start_date.getFullYear()}`
    };
    if (end_date) {
      new_exp.end_date = `${
        months[end_date.getMonth()]
      } ${end_date.getFullYear()}`;
    }
    return new_exp;
  });

export const parsePDF = dataBuffer => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);

    pdfParser.on('pdfParser_dataError', reject);
    pdfParser.on('pdfParser_dataReady', () =>
      resolve(pdfParser.getRawTextContent())
    );

    pdfParser.parseBuffer(dataBuffer);
  });
};

export const generateNewUsername = async ({ email }) => {
  if (!email) return generateUsername();

  let username = generateFromEmail(email, 3);
  const user = await User.findOne({ username });
  if (user) {
    username = generateUsername();
  }
  return username;
};

export const formatSkills = skills => {
  const technical_skills = skills
    .filter(skill => skill.type === 'technical_skills')
    .map(skill => ({ name: skill.name, _id: skill._id.toString() }));
  const dev_tools = skills
    .filter(skill => skill.type === 'dev_tools')
    .map(skill => ({ name: skill.name, _id: skill._id.toString() }));
  const core_subjects = skills
    .filter(skill => skill.type === 'core_subjects')
    .map(skill => ({ name: skill.name, _id: skill._id.toString() }));
  const languages = skills
    .filter(skill => skill.type === 'languages')
    .map(skill => ({ name: skill.name, _id: skill._id.toString() }));

  return {
    technical_skills,
    dev_tools,
    core_subjects,
    languages
  };
};

import latex from 'node-latex';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import concat from 'concat-stream';
import fs from 'fs';
import { formatSkills, parsePDF } from '../utilities/index.js';

import User from '../models/user.js';
import templates from '../resume/index.js';
import ExpressError from '../utilities/express-error.js';
import {
  extractDataFromResume,
  // rewriteAchievements,
  rewriteDescriptions,
  rewriteSentence
} from '../utilities/text-davinci.js';
import Resume from '../models/resume.js';
import { v4 as uuidv4 } from 'uuid';

import { s3_client } from '../index.js';
import {
  deleteResumeDB,
  getResumeDetailsDB,
  saveResumeDB,
  updateResumeDetailsDB
} from '../db/resume.js';
import {
  rewriteAchievements,
  rewriteExperiences,
  rewriteProjects
} from '../utilities/rewrite-funcitons.js';
import {
  skillCompareFunction,
  updateEducationsForResume,
  updateExperiencesForResume
} from '../utilities/index.js';
import { updateUserDB } from '../db/user.js';
import { addNewEducationDB } from '../db/education.js';
import { addNewExperienceDB } from '../db/experience.js';
import { addNewProjectDB } from '../db/project.js';
import moment from 'moment';

const getUserData = async user_id => {
  const user = await User.findById(user_id)
    .populate(['experiences', 'educations', 'skills', 'projects'])
    .lean();

  return {
    ...user,
    ...formatSkills(user.skills)
  };
};

export const getNewResumeData = async (req, res) => {
  const user_id = req.user._id;
  const { rewrite = false } = req.query;
  const { job_description } = req.body;
  const userData = await getUserData(user_id);

  if (rewrite === 'true') {
    userData.experiences = await rewriteExperiences(
      userData.experiences,
      job_description
    );

    userData.projects = await rewriteProjects(
      userData.projects,
      job_description
    );

    userData.achievements = await rewriteAchievements(
      userData.achievements,
      job_description
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

  const resumeData = {
    ...req.body,
    experiences: updateExperiencesForResume(req.body.experiences),
    educations: updateEducationsForResume(req.body.educations)
  };

  const resume = templates['engineeringTemplates'][template_id](resumeData);

  const pdf = latex(resume);
  pdf.pipe(res);

  pdf.on('error', err => {
    res.status(500).json({ error: 'Error generating the PDF!' });
  });

  // const id = uuidv4();
  // pdf.pipe(
  //   concat(async pdfData => {
  //     const command = new PutObjectCommand({
  //       Bucket: 'resumer-data-files',
  //       Key: `resume/${id}.pdf`,
  //       Body: pdfData
  //       // ACL: 'public-read'
  //     });

  //     await s3_client.send(command);

  //     const getSignedUrlParams = {
  //       Bucket: 'resumer-data-files',
  //       Key: `resume/${id}.pdf`
  //     };

  //     const signedUrlCommand = new GetObjectCommand(getSignedUrlParams);
  //     const signedUrl = await getSignedUrl(s3_client, signedUrlCommand, {
  //       expiresIn: 36000
  //     });

  //     res.status(200).send({
  //       // url: `https://resumer-data-files.s3.ap-south-1.amazonaws.com/resume/${id}.pdf`
  //       url: signedUrl
  //     });
  //     return;
  //   })
  // );
};

export const saveEngineeringResume = async (req, res) => {
  const { template_id } = req.params;

  if (
    parseInt(template_id) >=
    Object.keys(templates['engineeringTemplates']).length
  )
    throw new ExpressError(
      `Template with id: ${template_id} does not exist`,
      404
    );

  const { user } = req;
  await saveResume({
    user,
    template_id,
    template_category: 'engineeringTemplates',
    data: JSON.stringify(req.body)
  });

  res.status(200).send({
    success: true
  });
};

export const updateResume = async (req, res) => {
  const { resume_id } = req.params;
  const { user } = req;
  await updateResumeDetailsDB({
    resume_id,
    user_id: user._id,
    data: JSON.stringify(req.body)
  });
  res.status(200).send({
    success: true
  });
};

export const getResumeDetails = async (req, res) => {
  const { resume_id } = req.params;
  const resume = await getResumeDetailsDB({ resume_id });

  if (resume && resume.user.toString() === req.user._id.toString()) {
    res.status(200).send({
      success: true,
      resume: {
        ...resume.toJSON(),
        data: JSON.parse(resume.data),
        user: undefined
      }
    });
  } else {
    throw new ExpressError('Resume not found!', 404);
  }
};

export const deleteResume = async (req, res) => {
  const { resume_id } = req.params;
  const is_authorsed = req.user.resumes.find(
    resume => resume._id.toString() === resume_id
  );

  if (!is_authorsed) {
    throw new ExpressError('You are not authorised to delete the resume', 401);
  }

  await deleteResumeDB({ resume_id });
  res.status(200).send({
    success: true
  });
};

export const loadResume = async (req, res) => {
  const { resume_id } = req.params;
  const resume = await getResumeDetailsDB({ resume_id });

  if (resume) {
    const tex = templates[resume.template_category][resume.template_id](
      JSON.parse(resume.data)
    );

    const pdf = latex(tex);
    pdf.pipe(res);
  } else {
    throw new ExpressError('Resume not found!', 404);
  }
};

export const rewriteStatement = async (req, res) => {
  const { statement, job_description } = req.body;
  const updatedStatement = await rewriteSentence(statement, job_description);
  res.status(200).send({
    success: true,
    statement: updatedStatement
  });
};

export const rewriteDescription = async (req, res) => {
  const { description, job_description } = req.body;
  const updatesDescription = await rewriteDescriptions(
    description,
    job_description
  );
  res.status(200).send({
    success: true,
    description: updatesDescription
  });
};

export const parseResume = async (req, res) => {
  const { user } = req;
  const dataBuffer = req.file.buffer;

  if (!dataBuffer) {
    return res.status(400).send('No file uploaded.');
  }

  const resumeText = await parsePDF(dataBuffer);
  const data = await extractDataFromResume(resumeText);

  try {
    await updateUserDB({
      user_id: user._id,
      name: data.name,
      phone: data.phone_number,
      city: data.city,
      state: data.city,
      achievements: data.achievements
    });
  } catch (err) {
    console.log(err);
  }
  for (let education of data.educations) {
    try {
      await addNewEducationDB({ ...education, user });
    } catch (err) {
      console.log(err);
    }
  }
  for (let experience of data.experiences) {
    try {
      await addNewExperienceDB({
        ...experience,
        start_date: moment(new Date(experience.start_date)).format(
          'DD-MM-YYYY'
        ),
        end_date: moment(new Date(experience.end_date)).format('DD-MM-YYYY'),
        user
      });
    } catch (err) {
      console.log(err);
    }
  }

  for (let project of data.projects) {
    try {
      await addNewProjectDB({ ...project, user });
    } catch (err) {
      console.log(err);
    }
  }

  res.send({ success: true, data });
};

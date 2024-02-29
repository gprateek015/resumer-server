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
  rewriteResumeData,
  rewriteSentence
} from '../utilities/text-davinci.js';
import Resume from '../models/resume.js';
import { v4 as uuidv4 } from 'uuid';

import { s3_client } from '../index.js';
import {
  deleteEducationsDB,
  deleteExperiencesDB,
  deleteProjectsDB,
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
import { deleteEducation } from './education.js';
import Experience from '../models/experience.js';
import Project from '../models/project.js';
import Education from '../models/education.js';

const getUserData = async user_id => {
  const user = await User.findById(user_id).populate('skills').lean();
  const experiences = await Experience.find({ user_id }).lean();
  const projects = await Project.find({ user_id }).lean();
  const educations = await Education.find({ user_id }).lean();

  return {
    ...user,
    ...formatSkills(user.skills),
    experiences,
    projects,
    educations,
    hash_password: undefined,
    skills: undefined
  };
};

export const getNewResumeData = async (req, res) => {
  const user = req.user;
  const user_id = user._id;
  const { rewrite = false } = req.query;
  const { job_description } = req.body;
  let userData = await getUserData(user_id);

  if (rewrite === 'true' && job_description) {
    if (user.r_coins < process.env.NEW_RESUMER_CHARGES) {
      throw new ExpressError('Daily limit exceeded', 400);
    }

    const newData = await rewriteResumeData({ ...userData, job_description });
    userData.experiences = newData.experiences;
    userData.projects = newData.projects;
    userData.achievements = newData.achievements;

    await User.findByIdAndUpdate(user_id, {
      r_coins: user.r_coins - process.env.NEW_RESUMER_CHARGES
    });
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
  await saveResumeDB({
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

  res.json({
    success: true,
    data: {
      _id: '65d8df8c50990f0c86bc38f8',
      name: 'Prateek Goyal',
      username: 'gprateek015688',
      email: 'gprateek015@gmail.com',
      achievements: [
        'Led a team of 5 members to the Smart India Hackathon 2022 Finals. Out of a total of 125 submissions across India, we were among the top 5 teams in the finals (Link)',
        'Specialist at Codeforces with Highest rating of 1470 and Knight at Leetcode with 2000+ rating',
        'Ranked 292 among 29k+ participants across the Globe and AIR 69 in Leetcode Biweekly contest 111 (Link)',
        'Ranked 620 at ICPC Kanpur region preliminary round'
      ],
      skills: [
        '65c54aaf414ba3af14f64243',
        '65c54aaf414ba3af14f64246',
        '65c54aaf414ba3af14f6424c'
      ],
      referred_by: null,
      referral_code: 's598i384r628i565',
      user_role: 'user',
      resumes: [],
      onboarding_completed: false,
      profile_links: [],
      certificates: [],
      github: 'https://www.linkedin.com/in/prateek-goyal1/',
      linkedin: 'https://www.linkedin.com/in/prateek-goyal1/',
      phone: '+91 7999956584',
      city: 'Jabalpur',
      state: 'Madhya Pradesh',
      id: '65d8df8c50990f0c86bc38f8',
      educations: [
        {
          institute_name: 'Jabalpur Engineering College',
          start_year: 2020,
          end_year: 2024,
          score: 8.43,
          scoring_type: 'cgpa',
          maximum_score: 10,
          user_id: '65d8df8c50990f0c86bc38f8',
          _id: '65da5cd80c26d9e86c893c4b',
          id: '65da5cd80c26d9e86c893c4b'
        }
      ],
      experiences: [
        {
          company_name: 'Wikasta Business and Technical Solutions Pvt. Ltd.',
          position: 'Frontend Developer Intern',
          start_date: '01-10-2022',
          end_date: '01-09-2023',
          description: [
            'Led the front-end team of 5 developers to establish a collaborative and high-performing work environment',
            'Worked on four different platforms, including React.js based web applications and a React native application',
            'Developed several features and resolved 150+ bugs using Rollbar which improved the performance by 40%'
          ],
          mode: 'remote',
          user_id: '65d8df8c50990f0c86bc38f8',
          _id: '65da5cd80c26d9e86c893c4d',
          id: '65da5cd80c26d9e86c893c4d'
        },
        {
          company_name: 'Fitmedik Inc',
          position: 'Software Development Intern',
          start_date: '01-07-2022',
          end_date: '01-09-2022',
          description: [
            'Implemented location-based features using React Native Expo tools and native concepts of Android and iOS',
            'Worked with a variety of complex features, including Bluetooth technology to fetch and connect with nearby devices',
            'Created 5+ inter-related schemas maintaining consistency and reducing redundancy within a NoSQL database'
          ],
          mode: 'remote',
          user_id: '65d8df8c50990f0c86bc38f8',
          _id: '65da5cd80c26d9e86c893c4f',
          id: '65da5cd80c26d9e86c893c4f'
        },
        {
          company_name: 'Salonify',
          position: 'Software Development Intern',
          start_date: '01-02-2022',
          end_date: '01-04-2022',
          description: [
            'Dug deep into the details of the Payment and Cancellation Policies ensuring seamless and stress-free experience',
            'Integrated AWS Amplify and improved the re-render performance of a React Native application by 25%'
          ],
          mode: 'remote',
          user_id: '65d8df8c50990f0c86bc38f8',
          _id: '65da5cd80c26d9e86c893c51',
          id: '65da5cd80c26d9e86c893c51'
        },
        {
          company_name: 'Doions Pvt. Ltd.',
          position: 'Software Engineering Intern',
          start_date: '01-06-2021',
          end_date: '01-08-2021',
          description: [
            'Redesigned the complete website using React.js, which resulted in an increase of about 30% in user attraction',
            'Designed 3+ mailing templates and fixed several backend bugs resulting in a 25% improvement in performance'
          ],
          mode: 'remote',
          user_id: '65d8df8c50990f0c86bc38f8',
          _id: '65da5cd80c26d9e86c893c53',
          id: '65da5cd80c26d9e86c893c53'
        }
      ],
      projects: [
        {
          name: 'Resumer',
          skills_required: [
            'Next.js',
            'Typescript',
            'Docker',
            'AWS',
            'Node.js',
            'MongoDB'
          ],
          description: [
            'Engineered ATS-friendly resume builder toolkit with OpenAI’s LLM for precise text processing & paraphrasing',
            'Implemented intelligent resume parsing, automating onboarding procedures for a seamless user experience',
            'Streamlined the entire resume building process with a single-click solution, optimizing resume generation based on specific job descriptions, all powered by LaTeX for precision.'
          ],
          user_id: '65d8df8c50990f0c86bc38f8',
          _id: '65da5cd80c26d9e86c893c55',
          id: '65da5cd80c26d9e86c893c55'
        },
        {
          name: 'My-Torrent',
          skills_required: ['C++', 'Socket Programming', 'Networking', 'Unix'],
          description: [
            'My-torrent is a miniature version of Bit-torrent for peer-to-peer file sharing designed for fast and reliable sharing',
            'Parts of a large file are uploaded by different peers and downloaded by one providing a higher download speed',
            'It supports multi-threading, peer registration, socket and network programming, and decentralised network'
          ],
          user_id: '65d8df8c50990f0c86bc38f8',
          _id: '65da5cd80c26d9e86c893c57',
          id: '65da5cd80c26d9e86c893c57'
        }
      ]
    }
  });
  return;

  if (!dataBuffer) {
    return res.status(400).send('No file uploaded.');
  }

  // deleting all educations, projects and experiences
  await deleteEducationsDB({ user_id: user._id });
  await deleteExperiencesDB({ user_id: user._id });
  await deleteProjectsDB({ user_id: user._id });

  const resumeText = await parsePDF(dataBuffer);
  const data = await extractDataFromResume(resumeText);

  let userData = {};
  try {
    userData = await updateUserDB({
      user_id: user._id,
      name: data.name,
      phone: data.phone_number,
      city: data.city,
      state: data.state,
      achievements: data.achievements
    });
  } catch (err) {
    console.log(err);
  }
  let educations = [];
  for (let education of data.educations) {
    try {
      const data = await addNewEducationDB({ ...education, user });
      educations.push(data.toJSON());
    } catch (err) {
      console.log(err);
    }
  }
  let experiences = [];
  for (let experience of data.experiences) {
    try {
      const data = await addNewExperienceDB({
        ...experience,
        start_date: moment(new Date(experience.start_date)).format(
          'DD-MM-YYYY'
        ),
        end_date: moment(new Date(experience.end_date)).format('DD-MM-YYYY'),
        user
      });
      experiences.push(data.toJSON());
    } catch (err) {
      console.log(err);
    }
  }

  let projects = [];
  for (let project of data.projects) {
    try {
      const data = await addNewProjectDB({ ...project, user });
      projects.push(data.toJSON());
    } catch (err) {
      console.log(err);
    }
  }

  res.send({
    success: true,
    data: { ...userData.toJSON(), educations, experiences, projects }
  });
};

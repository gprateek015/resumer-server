import latex from "node-latex";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import concat from "concat-stream";
import fs from "fs";
import { formatSkills, parsePDF } from "../utilities/index.js";

import UserProfile from "../models/user-profile.js";
import templates from "../resume/index.js";
import ExpressError from "../utilities/express-error.js";
import {
  extractDataFromResume,
  // rewriteAchievements,
  rewriteDescriptions,
  rewriteResumeData,
  rewriteSentence,
} from "../utilities/text-davinci.js";
import Resume from "../models/resume.js";
import { v4 as uuidv4 } from "uuid";

import { s3_client } from "../index.js";
import {
  deleteEducationsDB,
  deleteExperiencesDB,
  deleteProjectsDB,
  deleteResumeDB,
  getResumeDetailsDB,
  saveResumeDB,
  updateResumeDetailsDB,
} from "../db/resume.js";
import {
  rewriteAchievements,
  rewriteExperiences,
  rewriteProjects,
} from "../utilities/rewrite-funcitons.js";
import {
  skillCompareFunction,
  updateEducationsForResume,
  updateExperiencesForResume,
} from "../utilities/index.js";
import { updateUserProfileDB } from "../db/user-profile.js";
import { addNewEducationDB } from "../db/education.js";
import { addNewExperienceDB } from "../db/experience.js";
import { addNewProjectDB } from "../db/project.js";
import moment from "moment";
import { deleteEducation } from "./education.js";
import Experience from "../models/experience.js";
import Project from "../models/project.js";
import Education from "../models/education.js";

const getUserProfileData = async (user_id) => {
  const user = await UserProfile.findById(user_id).populate("skills").lean();
  const experiences = await Experience.find({ user: user_id }).lean();
  const projects = await Project.find({ user: user_id }).lean();
  const educations = await Education.find({ user: user_id }).lean();

  return {
    ...user,
    ...formatSkills(user.skills),
    experiences,
    projects,
    educations,
    hash_password: undefined,
    skills: undefined,
  };
};

export const getNewResumeData = async (req, res) => {
  const user = req.user;
  const user_id = user._id;
  const { rewrite = false } = req.query;
  const { job_description } = req.body;
  let userData = await getUserProfileData(user_id);

  if (rewrite === "true" && job_description) {
    if (user.r_coins < process.env.NEW_RESUMER_CHARGES) {
      throw new ExpressError("Daily limit exceeded", 400);
    }

    const newData = await rewriteResumeData({ ...userData, job_description });
    userData.experiences = userData.experiences.length
      ? newData.experiences
      : [];
    userData.projects = userData.projects.length ? newData.projects : [];
    userData.achievements = userData.achievements.length
      ? newData.achievements
      : [];

    await UserProfile.findByIdAndUpdate(user_id, {
      r_coins: user.r_coins - process.env.NEW_RESUMER_CHARGES,
    });
  }

  res.status(200).send(userData);
};

export const loadEngineeringResume = async (req, res) => {
  const { template_id } = req.params;

  if (
    parseInt(template_id) >=
    Object.keys(templates["engineeringTemplates"]).length
  )
    throw new ExpressError(
      `Template with id: ${template_id} does not exist`,
      404
    );

  const resumeData = {
    ...req.body,
    experiences: updateExperiencesForResume(req.body.experiences),
    educations: updateEducationsForResume(req.body.educations),
  };

  const resume = templates["engineeringTemplates"][template_id](resumeData);

  const pdf = latex(resume);
  pdf.pipe(res);

  pdf.on("error", (err) => {
    console.log(err);
    res.status(500).json({ error: "Error generating the PDF!" });
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
    Object.keys(templates["engineeringTemplates"]).length
  )
    throw new ExpressError(
      `Template with id: ${template_id} does not exist`,
      404
    );

  const { user } = req;
  await saveResumeDB({
    user,
    template_id,
    template_category: "engineeringTemplates",
    data: JSON.stringify(req.body),
  });

  res.status(200).send({
    success: true,
  });
};

export const updateResume = async (req, res) => {
  const { resume_id } = req.params;
  const { user } = req;
  await updateResumeDetailsDB({
    resume_id,
    user_id: user._id,
    data: JSON.stringify(req.body),
  });
  res.status(200).send({
    success: true,
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
        user: undefined,
      },
    });
  } else {
    throw new ExpressError("Resume not found!", 404);
  }
};

export const deleteResume = async (req, res) => {
  const { resume_id } = req.params;
  const is_authorsed = req.user.resumes.find(
    (resume) => resume._id.toString() === resume_id
  );

  if (!is_authorsed) {
    throw new ExpressError("You are not authorised to delete the resume", 401);
  }

  await deleteResumeDB({ resume_id });
  res.status(200).send({
    success: true,
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
    throw new ExpressError("Resume not found!", 404);
  }
};

export const rewriteStatement = async (req, res) => {
  const { statement, job_description } = req.body;
  const updatedStatement = await rewriteSentence(statement, job_description);
  res.status(200).send({
    success: true,
    statement: updatedStatement,
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
    description: updatesDescription,
  });
};

export const parseResume = async (req, res) => {
  const { user } = req;
  const dataBuffer = req.file.buffer;

  if (!dataBuffer) {
    return res.status(400).send("No file uploaded.");
  }

  // deleting all educations, projects and experiences
  await deleteEducationsDB({ user_id: user._id });
  await deleteExperiencesDB({ user_id: user._id });
  await deleteProjectsDB({ user_id: user._id });

  const resumeText = await parsePDF(dataBuffer);
  const data = await extractDataFromResume(resumeText);

  let userData = {};
  try {
    userData = await updateUserProfileDB({
      user_id: user._id,
      name: data.name,
      phone: data.phone_number,
      city: data.city,
      state: data.state,
      achievements: data.achievements,
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
          "DD-MM-YYYY"
        ),
        end_date: moment(new Date(experience.end_date)).format("DD-MM-YYYY"),
        user,
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
    data: { ...userData.toJSON(), educations, experiences, projects },
  });
};

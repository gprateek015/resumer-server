import { rewriteDescriptions, rewriteSentence } from './text-davinci.js';

export const rewriteExperiences = async (experiences, job_description) => {
  const newExperiences = [];
  for (let experience of experiences) {
    newExperiences.push(
      await rewriteDescriptions(experience.description, job_description)
    );
  }
  return newExperiences;

  // return await Promise.all(
  //   experiences.map(async experience => {
  //     experience.description = await rewriteDescriptions(
  //       experience.description,
  //       job_description
  //     );
  //     return experience;
  //   })
  // );
};

export const rewriteProjects = async (projects, job_description) => {
  const newProjects = [];
  for (let project of projects) {
    newProjects.push(
      await rewriteDescriptions(project.description, job_description)
    );
  }
  return newProjects;

  // return await Promise.all(
  //   projects.map(async project => {
  //     project.description = await rewriteDescriptions(
  //       project.description,
  //       job_description
  //     );
  //     return project;
  //   })
  // );
};

export const rewriteAchievements = async (achievements, job_description) => {
  const newAchievements = [];
  for (let achievement of achievements) {
    newAchievements.push(
      await rewriteDescriptions(achievement.description, job_description)
    );
  }
  return newAchievements;

  // return await Promise.all(
  //   achievements.map(
  //     async achievement => await rewriteSentence(achievement, job_description)
  //   )
  // );
};

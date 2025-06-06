import Project from "../models/project.js";
import UserProfile from "../models/user-profile.js";

export const fetchProjectsFromDB = async (user) => {
  const projects = await Project.find({ user: user._id });
  return projects;
};

export const addNewProjectDB = async ({
  name,
  skills_required,
  description,
  live_url,
  video_url,
  code_url,
  user,
}) => {
  const newProject = new Project({
    name,
    skills_required,
    description,
    live_url,
    video_url,
    code_url,
    user: user,
  });

  await newProject.save();

  return newProject;
};
export const deleteProjectDB = async ({ project_id, user_id }) => {
  await Project.findOneAndDelete({
    $and: [{ _id: project_id }, { user: user_id }],
  });
};

export const updateProjectDB = async ({
  name,
  skills_required,
  description,
  live_url,
  video_url,
  code_url,
  project_id,
  user_id,
}) => {
  const project = await Project.findOneAndUpdate(
    { $and: [{ _id: project_id }, { user: user_id }] },
    { name, skills_required, description, live_url, video_url, code_url },
    { new: true, runValidators: true }
  );

  return project;
};

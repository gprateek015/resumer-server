import Project from '../models/project.js';
import User from '../models/user.js';

export const fetchProjectsFromDB = async user => {
  const { projects } = await User.findById(user.id).populate('projects');
  return projects;
};

export const addNewProjectDB = async ({
  name,
  skills_required,
  description,
  live_url,
  video_url,
  code_url,
  user
}) => {
  const newProject = new Project({
    name,
    skills_required,
    description,
    live_url,
    video_url,
    code_url,
    user_id: user.id
  });
  user.projects.push(newProject);

  await newProject.save();
  await user.save();

  return newProject;
};
export const deleteProjectDB = async ({ project_id, user_id }) => {
  await Project.findOneAndDelete({ $and: [{ _id: project_id }, { user_id }] });
};

export const updateProjectDB = async ({
  name,
  skills_required,
  description,
  live_url,
  video_url,
  code_url,
  project_id,
  user_id
}) => {
  const project = await Project.findOneAndUpdate(
    { $and: [{ _id: project_id }, { user_id }] },
    { name, skills_required, description, live_url, video_url, code_url },
    { new: true, runValidators: true }
  );

  return project;
};

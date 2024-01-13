import {
  addNewProjectDB,
  deleteProjectDB,
  updateProjectDB,
  fetchProjectsFromDB
} from '../db/project.js';

export const fetchProjects = async (req, res) => {
  const projects = await fetchProjectsFromDB(req.user);
  res.status(200).send({
    success: true,
    projects
  });
};

export const addNewProject = async (req, res) => {
  const user = req.user;
  const { name, skills_required, description, live_url, video_url, code_url } =
    req.body;

  const newProject = await addNewProjectDB({
    name,
    skills_required,
    description,
    live_url,
    video_url,
    code_url,
    user
  });

  res.status(200).send({
    success: true
  });
};

export const deleteProject = async (req, res) => {
  const { project_id } = req.params;
  const { user } = req;

  await deleteProjectDB({ project_id, user_id: user.id });

  res.status(200).send({
    success: true
  });
};

export const updateProject = async (req, res) => {
  const { name, skills_required, description, live_url, video_url, code_url } =
    req.body;
  const { project_id } = req.params;
  const { user } = req;

  const project = updateProjectDB({
    name,
    skills_required,
    description,
    live_url,
    video_url,
    code_url,
    project_id,
    user_id: user.id
  });

  res.status(200).send({
    success: true
  });
};

export default {
  addNewProject,
  deleteProject,
  updateProject
};

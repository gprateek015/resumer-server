import Project from '../models/project.js';

export const addNewProject = async (req, res) => {
  const user_id = req.user._id;
  const user = req.user;

  const newProject = new Project({ ...req.body, user_id });
  user.projects.push(newProject);

  await newProject.save();
  await user.save();

  res.status(200).send({
    success: true,
    project: newProject
  });
};

export const deleteProject = async (req, res) => {
  const project_id = req.body.project_id;
  await Project.findOneAndDelete({ _id: project_id });

  res.status(200).send({
    success: true
  });
};

export const updateProject = async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.body._id },
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.status(200).send({
    success: true,
    project: { ...project.toJSON() }
  });
};

export default {
  addNewProject,
  deleteProject,
  updateProject
};

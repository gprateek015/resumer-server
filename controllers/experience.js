import Experience from '../models/experience.js';

export const addNewExperience = async (req, res) => {
  const user_id = req.user.id;
  const user = req.user;

  const newExperience = new Experience({ ...req.body, user_id });
  user.experiences.push(newExperience);

  await newExperience.save();
  await user.save();

  res.status(200).send({
    success: true,
    experience: newExperience
  });
};

export const deleteExperience = async (req, res) => {
  const exp_id = req.body.experience_id;
  await Experience.findOneAndDelete({ _id: exp_id });

  res.status(200).send({
    success: true
  });
};

export const updateExperience = async (req, res) => {
  const experience = await Experience.findOneAndUpdate(
    { _id: req.body.id },
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.status(200).send({
    success: true,
    experience: { ...experience.toJSON() }
  });
};

export default {
  addNewExperience,
  deleteExperience,
  updateExperience
};

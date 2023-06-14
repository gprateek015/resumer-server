import Education from '../models/education.js';

export const addNewEducation = async (req, res) => {
  const user = req.user;

  const newEducation = new Education({ ...req.body, user_id: user.id });
  user.educations.push(newEducation);

  await newEducation.save();
  await user.save();

  res.status(200).send({
    success: true,
    experience: newEducation
  });
};

export const deleteEducation = async (req, res) => {
  const edu_id = req.body.education_id;
  await Education.findOneAndDelete({ _id: edu_id });

  res.status(200).send({
    success: true
  });
};

export const updateEducation = async (req, res) => {
  const education = await Education.findOneAndUpdate(
    { _id: req.body.id },
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.status(200).send({
    success: true,
    education: { ...education.toJSON() }
  });
};

export default {
  addNewEducation,
  deleteEducation,
  updateEducation
};

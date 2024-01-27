import Resume from '../models/resume.js';

export const saveResumeDB = async ({
  user,
  template_id,
  template_category,
  data
}) => {
  const resume = new Resume({
    data,
    template_id,
    template_category,
    user
  });

  resume.filename = `${user.name}-${resume._id.substr(0, 2)}`;
  await resume.save();

  user.resumes = [...(user.resumes || []), resume];
  await user.save();

  return resume;
};

export const getResumeDetailsDB = async ({ resume_id }) => {
  return await Resume.findById(resume_id);
};

export const deleteResumeDB = async ({ resume_id }) => {
  await Resume.findByIdAndDelete(resume_id);
};

export const updateResumeDetailsDB = async ({ resume_id, user_id, data }) => {
  return await Resume.findOneAndUpdate(
    { $and: [{ _id: resume_id, user: user_id }] },
    {
      data
    }
  );
};

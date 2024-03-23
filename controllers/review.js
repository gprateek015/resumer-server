import { addReviewDB } from '../db/review.js';

export const addReview = async (req, res) => {
  const { description } = req.body;

  await addReviewDB({ description });
  res.status(200).json({ success: true });
};

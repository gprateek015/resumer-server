import Review from '../models/review.js';

export const addReviewDB = async ({ description, user }) => {
  const newReview = new Review({ description, user });
  await newReview.save();
};

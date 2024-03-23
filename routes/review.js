import express from 'express';
import catchAsync from '../utilities/catch-async.js';
import { addReview } from '../controllers/review.js';

const router = express.Router();

router.route('/').post(catchAsync(addReview));

export default router;

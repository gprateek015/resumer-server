import express from 'express';

import { getResume } from '../controllers/resume.js';
import { authenticateUser } from '../middleware.js';
import catchAsync from '../utilities/catchAsync.js';

const router = express.Router();

router.route('/:id').get(authenticateUser, catchAsync(getResume));

export default router;

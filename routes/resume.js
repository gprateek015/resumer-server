import express from 'express';

import {
  getEngineeringResumeData,
  loadEngineeringResume,
  rewriteDescription,
  rewriteStatement
} from '../controllers/resume.js';
import { authenticateUser } from '../middleware.js';
import catchAsync from '../utilities/catch-async.js';

const router = express.Router();

router
  .route('/data')
  .get(authenticateUser, catchAsync(getEngineeringResumeData));

router
  .route('/engineering/:template_id/load')
  .post(authenticateUser, catchAsync(loadEngineeringResume));

router
  .route('/rewrite-statement')
  .post(authenticateUser, catchAsync(rewriteStatement));

router
  .route('/rewrite-description')
  .post(authenticateUser, catchAsync(rewriteDescription));

export default router;

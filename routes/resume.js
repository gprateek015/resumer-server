import express from 'express';

import {
  deleteResume,
  getEngineeringResumeData,
  getResumeDetails,
  loadEngineeringResume,
  rewriteDescription,
  rewriteStatement,
  saveEngineeringResume
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
  .route('/engineering/:template_id/save')
  .post(authenticateUser, catchAsync(saveEngineeringResume));

router
  .route('/rewrite-statement')
  .post(authenticateUser, catchAsync(rewriteStatement));

router
  .route('/rewrite-description')
  .post(authenticateUser, catchAsync(rewriteDescription));

router
  .route('/:resume_id')
  .get(authenticateUser, catchAsync(getResumeDetails))
  .delete(authenticateUser, catchAsync(deleteResume));

export default router;

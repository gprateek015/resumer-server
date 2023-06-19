import express from 'express';

import {
  deleteResume,
  getNewResumeData,
  getResumeDetails,
  loadEngineeringResume,
  loadResume,
  rewriteDescription,
  rewriteStatement,
  saveEngineeringResume
} from '../controllers/resume.js';
import { authenticateUser } from '../middleware.js';
import catchAsync from '../utilities/catch-async.js';

const router = express.Router();

router.route('/data-new').get(authenticateUser, catchAsync(getNewResumeData));

router
  .route('/engineering/:template_id/load')
  .post(authenticateUser, catchAsync(loadEngineeringResume));

router
  .route('/engineering/:template_id/save')
  .post(authenticateUser, catchAsync(saveEngineeringResume));

router
  .route('/:resume_id')
  .get(authenticateUser, catchAsync(getResumeDetails))
  .delete(authenticateUser, catchAsync(deleteResume));

router.route('/:resume_id/load').get(catchAsync(loadResume));

router
  .route('/rewrite-statement')
  .post(authenticateUser, catchAsync(rewriteStatement));

router
  .route('/rewrite-description')
  .post(authenticateUser, catchAsync(rewriteDescription));

export default router;

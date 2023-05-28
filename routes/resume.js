import express from 'express';

import {
  getEngineeringResume,
  rewriteDescription,
  rewriteStatement
} from '../controllers/resume.js';
import { authenticateUser } from '../middleware.js';
import catchAsync from '../utilities/catch-async.js';

const router = express.Router();

router
  .route('/engineering/:id')
  .get(authenticateUser, catchAsync(getEngineeringResume));

router
  .route('/rewrite-statement')
  .post(authenticateUser, catchAsync(rewriteStatement));

router
  .route('/rewrite-description')
  .post(authenticateUser, catchAsync(rewriteDescription));

export default router;

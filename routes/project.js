import express from 'express';
import {
  addNewProject,
  deleteProject,
  updateProject
} from '../controllers/project.js';
import {
  authenticateUser,
  validateProject,
  validateProjectDelete,
  validateProjectUpdate
} from '../middleware.js';
import catchAsync from '../utilities/catchAsync.js';
import catchValidationAsync from '../utilities/catchValidationAsync.js';

const router = express.Router();

router
  .route('/')
  .post(
    authenticateUser,
    catchValidationAsync(validateProject),
    catchAsync(addNewProject)
  )
  .delete(
    authenticateUser,
    catchValidationAsync(validateProjectDelete),
    catchAsync(deleteProject)
  )
  .put(
    authenticateUser,
    catchValidationAsync(validateProjectUpdate),
    catchAsync(updateProject)
  );

export default router;

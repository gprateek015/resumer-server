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
import catchAsync from '../utilities/catch-async.js';
import catchValidationAsync from '../utilities/catch-validation-async.js';

const router = express.Router();

router
  .route('/')
  .post(
    authenticateUser,
    catchValidationAsync(validateProject),
    catchAsync(addNewProject)
  );
router
  .route('/:project_id')
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

import express from 'express';
import {
  addNewExperience,
  deleteExperience,
  updateExperience
} from '../controllers/experience.js';
import {
  authenticateUser,
  validateExperience,
  validateExperienceDelete,
  validateExperienceUpdate
} from '../middleware.js';
import catchAsync from '../utilities/catch-async.js';
import catchValidationAsync from '../utilities/catch-validation-async.js';

const router = express.Router();

router
  .route('/')
  .post(
    authenticateUser,
    catchValidationAsync(validateExperience),
    catchAsync(addNewExperience)
  )
  .delete(
    authenticateUser,
    catchValidationAsync(validateExperienceDelete),
    catchAsync(deleteExperience)
  )
  .put(
    authenticateUser,
    catchValidationAsync(validateExperienceUpdate),
    catchAsync(updateExperience)
  );

export default router;

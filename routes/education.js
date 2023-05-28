import express from 'express';
import {
  addNewEducation,
  deleteEducation,
  updateEducation
} from '../controllers/education.js';
import {
  authenticateUser,
  validateEducation,
  validateEducationDelete,
  validateEducationUpdate
} from '../middleware.js';
import catchAsync from '../utilities/catch-async.js';
import catchValidationAsync from '../utilities/catch-validation-async.js';

const router = express.Router();

router
  .route('/')
  .post(
    authenticateUser,
    catchValidationAsync(validateEducation),
    catchAsync(addNewEducation)
  )
  .delete(
    authenticateUser,
    catchValidationAsync(validateEducationDelete),
    catchAsync(deleteEducation)
  )
  .put(
    authenticateUser,
    catchValidationAsync(validateEducationUpdate),
    catchAsync(updateEducation)
  );

export default router;

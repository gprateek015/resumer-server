import express from 'express';
import {
  registerUser,
  fetchSelf,
  loginUser,
  updateUser
} from '../controllers/user.js';
import {
  authenticateUser,
  validateUser,
  validateUserUpdate,
  validateUserLogin
} from '../middleware.js';
import catchAsync from '../utilities/catchAsync.js';
import catchValidationAsync from '../utilities/catchValidationAsync.js';

const router = express.Router();

router
  .route('/')
  .post(catchValidationAsync(validateUser), catchAsync(registerUser))
  .put(
    authenticateUser,
    catchValidationAsync(validateUserUpdate),
    catchAsync(updateUser)
  );

router
  .route('/login')
  .post(catchValidationAsync(validateUserLogin), catchAsync(loginUser));

router.route('/self').get(authenticateUser, catchAsync(fetchSelf));

export default router;

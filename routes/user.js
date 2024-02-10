import express from 'express';
import {
  registerUser,
  fetchSelf,
  loginUser,
  updateUser,
  getPublicProfile,
  socialLogin
} from '../controllers/user.js';
import {
  authenticateUser,
  validateUser,
  validateUserUpdate,
  validateUserLogin,
  validateSocialLogin
} from '../middleware.js';
import catchAsync from '../utilities/catch-async.js';
import catchValidationAsync from '../utilities/catch-validation-async.js';

const router = express.Router();

router
  .route('/')
  .get(authenticateUser, catchAsync(fetchSelf))
  .post(catchValidationAsync(validateUser), catchAsync(registerUser))
  .put(
    authenticateUser,
    catchValidationAsync(validateUserUpdate),
    catchAsync(updateUser)
  );

router
  .route('/login')
  .post(catchValidationAsync(validateUserLogin), catchAsync(loginUser));

router
  .route('/social-login')
  .post(catchValidationAsync(validateSocialLogin), catchAsync(socialLogin));

router.route('/:username').get(catchAsync(getPublicProfile));

export default router;

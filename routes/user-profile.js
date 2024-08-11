import express from "express";
import {
  registerUserProfile,
  fetchSelf,
  loginUser,
  updateUserProfile,
  getPublicProfile,
} from "../controllers/user-profile.js";
import {
  authenticateUser,
  authenticateAndCreateUser,
  validateUserProfile,
  validateUserProfileUpdate,
  validateUserProfileLogin,
} from "../middleware.js";
import catchAsync from "../utilities/catch-async.js";
import catchValidationAsync from "../utilities/catch-validation-async.js";

const router = express.Router();

router
  .route("/")
  .get(authenticateAndCreateUser, catchAsync(fetchSelf))
  .post(
    catchValidationAsync(validateUserProfile),
    catchAsync(registerUserProfile)
  )
  .put(
    authenticateAndCreateUser,
    catchValidationAsync(validateUserProfileUpdate),
    catchAsync(updateUserProfile)
  );

router
  .route("/login")
  .post(catchValidationAsync(validateUserProfileLogin), catchAsync(loginUser));

router.route("/:username").get(catchAsync(getPublicProfile));

export default router;

import express from "express";
import multer from "multer";

import {
  deleteResume,
  getNewResumeData,
  getResumeDetails,
  loadEngineeringResume,
  loadResume,
  parseResume,
  rewriteDescription,
  rewriteStatement,
  saveEngineeringResume,
} from "../controllers/resume.js";
import { authenticateUser } from "../middleware.js";
import catchAsync from "../utilities/catch-async.js";

const upload = multer();

const router = express.Router();

router.route("/data-new").post(authenticateUser, catchAsync(getNewResumeData));
router
  .route("/rewrite-statement")
  .post(authenticateUser, catchAsync(rewriteStatement));

router
  .route("/rewrite-description")
  .post(authenticateUser, catchAsync(rewriteDescription));

router
  .route("/parse-resume")
  .post(authenticateUser, upload.single("resume"), catchAsync(parseResume));

router
  .route("/engineering/:template_id/load")
  .post(authenticateUser, catchAsync(loadEngineeringResume));

router
  .route("/engineering/:template_id/save")
  .post(authenticateUser, catchAsync(saveEngineeringResume));

router
  .route("/:resume_id")
  .get(authenticateUser, catchAsync(getResumeDetails))
  .delete(authenticateUser, catchAsync(deleteResume));

router.route("/:resume_id/load").get(catchAsync(loadResume));

export default router;

import express from 'express';
import {
  addNewSkill,
  deleteSkill,
  updateSkill,
  getSkills
} from '../controllers/skill.js';
import {
  authenticateUser,
  validateSkill,
  validateSkillDelete,
  validateSkillUpdate
} from '../middleware.js';
import catchAsync from '../utilities/catchAsync.js';
import catchValidationAsync from '../utilities/catchValidationAsync.js';

const router = express.Router();

router
  .route('/')
  .post(
    authenticateUser,
    catchValidationAsync(validateSkill),
    catchAsync(addNewSkill)
  )
  .delete(
    authenticateUser,
    catchValidationAsync(validateSkillDelete),
    catchAsync(deleteSkill)
  )
  .put(
    authenticateUser,
    catchValidationAsync(validateSkillUpdate),
    catchAsync(updateSkill)
  )
  .get(authenticateUser, catchAsync(getSkills));

export default router;

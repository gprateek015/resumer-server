import express from 'express';
import catchAsync from '../utilities/catch-async.js';
import { generateOtp, verifyOtp } from '../controllers/otp.js';

const router = express.Router();

router.route('/generate').post(catchAsync(generateOtp));
router.route('/verify').post(catchAsync(verifyOtp));

export default router;

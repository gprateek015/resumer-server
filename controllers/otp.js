import OTP from "../models/otp.js";
import { generateRandomOTP, sendMail } from "../utilities/index.js";
import ExpressError from "../utilities/express-error.js";
import UserProfile from "../models/user-profile.js";

export const generateOtp = async (req, res) => {
  const { email, phone_no } = req.body;
  const otp = generateRandomOTP({ length: 6 });
  const expiry = Date.now() + 5 * 60 * 1000;

  const user = await UserProfile.findOne({ email });
  if (user) {
    throw new ExpressError("user_already_exist", 400);
  }

  const otpObject = await OTP.findOneAndUpdate(
    {
      $or: [{ email }, { phone_no }],
    },
    {
      otp,
      ...(email && { email }),
      ...(phone_no && { phone_no }),
      expiry,
      updated_on: Date.now(),
      verified: false,
    },
    {
      upsert: true,
      new: true,
    }
  );

  await sendMail({ email, subject: "Auth OTP", message: otp });

  if (!!otpObject.verified) {
    throw new ExpressError("email_already_verified", 400);
  }

  res.status(200).json({
    success: true,
  });
};

export const verifyOtp = async (req, res) => {
  const { email, phone_no, otp } = req.body;

  const otpObject = await OTP.findOne({ email, phone_no });

  if (otpObject.otp !== otp || otpObject.expiry < Date.now()) {
    throw new ExpressError("Invalid or Expired OTP");
  }

  otpObject.verified = true;
  await otpObject.save();

  res.status(200).json({ success: true });
};

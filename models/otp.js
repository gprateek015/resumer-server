import { Schema, model } from 'mongoose';

const otpSchema = new Schema(
  {
    email: {
      type: String,
      unique: true
    },
    phone_no: {
      type: String,
      unique: true
    },
    otp: {
      type: String,
      required: true
    },
    expiry: {
      type: Date,
      required: true
    },
    updated_on: {
      type: Date,
      required: true,
      default: Date.now()
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: 0,
    toJSON: {
      virtuals: true
    }
  }
);

const OTP = model('OTP', otpSchema);
export default OTP;

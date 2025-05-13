import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import { S3Client } from "@aws-sdk/client-s3";
import https from "https";
import fs from "fs";
import cron from "node-cron";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user-profile.js";
import experienceRouter from "./routes/experience.js";
import educationRouter from "./routes/education.js";
import skillRouter from "./routes/skill.js";
import projectRouter from "./routes/project.js";
import resumeRouter from "./routes/resume.js";
import optRouter from "./routes/otp.js";
import reviewRouter from "./routes/review.js";
import { setDefaultRCoin } from "./utilities/index.js";
import { GoogleGenAI } from "@google/genai";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

mongoose.connect(process.env.DB_URI).then(
  () => console.log("Database connected"),
  (err) => console.log("Error connecting database ", err)
);

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const s3_client = new S3Client({
  region: "ap-south-1",
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://resumer.cloud",
      "https://www.resumer.cloud",
      "https://resumercloud.vercel.app", // develop
      "https://resumer.prateeklab.com",
      "http://localhost:3000",
      "chrome-extension://*",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/experience", experienceRouter);
app.use("/education", educationRouter);
app.use("/project", projectRouter);
app.use("/skill", skillRouter);
app.use("/resume", resumeRouter);
app.use("/otp", optRouter);
app.use("/review", reviewRouter);

app.get("/", async (req, res) => {
  res.status(200).send("Server up and running!!");
});

app.all("*", async (req, res) => {
  res.status(404).send({ error: "Url not found!" });
});

app.use((err, req, res, next) => {
  const { status_code = 500 } = err;
  if (!err.message) err.message = "internal_server_error";

  res.status(status_code).send({
    error: err.message,
  });
});

cron.schedule("0 4 * * *", setDefaultRCoin, {
  timezone: "Asia/Kolkata",
  scheduled: true,
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening to port: ${PORT}`);
});

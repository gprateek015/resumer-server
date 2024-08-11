import express from "express";
import { getSkills } from "../controllers/skill.js";
import { authenticateUser } from "../middleware.js";
import catchAsync from "../utilities/catch-async.js";

const router = express.Router();

router.route("/").get(authenticateUser, catchAsync(getSkills));

export default router;

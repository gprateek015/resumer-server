import { genai, openai } from "../index.js";
import ExpressError from "./express-error.js";
import axios from "axios";

export const extractKeywords = async (job_description) => {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/transformer3/H1-keywordextractor",
    {
      inputs: job_description,
    },
    {
      headers: {
        Authorization: "Bearer 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",
      },
    }
  );
  const keywords = response.data.summary_text;
  return keywords;
};

export const rewriteDescriptions = async (description, job_description) => {
  return description;
};

export const rewriteSentence = async (sentence, job_description) => {
  return sentence;
};

export const rewriteAchievements = async (achievements) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `You are expert at content writing. Your task is to rewrite each sentence in about 15 words. Please seperate each sentence with a new line, it's most important. Sentences: ${achievements}`,
      max_tokens: 1000,
      temperature: 1,
      n: 1,
    });
    const resp = response.data.choices?.[0]?.text
      ?.split(/\. |\n/)
      ?.filter((sent) => sent !== "" && sent.length > 10)
      ?.map((desc) => desc.trim());
    return resp;
  } catch (err) {
    console.log(err.response);
    throw new ExpressError("", 500);
  }
};

export const extractDataFromResume = async (resume_text) => {
  try {
    const startTime = new Date();
    console.log("Started...");
    const chatCompletion = await genai.models.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `This is the the resume text - ${resume_text}`,
            },
          ],
        },
      ],
      model: "gemini-2.0-flash",
      config: {
        systemInstruction:
          "You are an expert of data extraction from any text input. Your task is to extract relevant data from the resume text given to you. You need to return the output as an object in key value pairs. Start with name, email, phone number as phone_number, city and state. Then for educations, each education should contain Institution name as institute_name, start year as start_year and end year as end_year and both must be numbers, scoring_type (must be either 'cgpa' or 'percentage'), maximum_score, score, education level as level and it can be one of lower_secondary, senior_secondary, diploma, graduation, post_graduation. Then for experiences, each experience must have company_name, position, mode which can be 'onsite', 'hybrid' or 'remote', location, start_date, end_date, then description. Then for projects, each project must contain Project name as name, skills_required (array of string), description. Then achievements as array of string. If any of the above is not mentioned add null in its position. Please be consistent in the key's name you give as it should be exactly same in every response and please give a valid json output. Also the description in experiences and projects should be array of string. experiences, educations and projects must be arrays.",
      },
    });
    console.log(`Time took: ${(new Date() - startTime) / 1000} seconds`);
    const data = chatCompletion.text;
    if (data.includes("```json")) {
      return JSON.parse(data.split("```json")[1].split("```")[0]);
    }
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    throw new ExpressError("AI API Error", 500);
  }
};
export const rewriteResumeData = async ({
  job_description,
  experiences,
  projects,
  achievements,
}) => {
  try {
    const startTime = new Date();
    console.log("Started...");
    console.log(experiences);
    console.log(projects);
    console.log(achievements);
    if (!experiences.length && !projects.length && !achievements.length) {
      return {};
    }
    const chatCompletion = await genai.models.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `This is the the job description - '${job_description}'. These are the details which you have to rewrite and return - 'work_experiences as experiences' - ${JSON.stringify(
                experiences
              )}. 'projects' - ${JSON.stringify(
                projects
              )}. 'acheivements' - ${JSON.stringify(achievements)}. `,
            },
          ],
        },
      ],
      model: "gemini-2.0-flash",
      config: {
        systemInstruction:
          "Your are a talented resume writer who uses action words and produces ATS friendly resumes based on a particular job description. I will provide a job description and some content and you need to give a json object which have to follow a specified order for the keys in the output in order to represent each content. It should strictly follow these keys for every rewrites - 1. WorkExperiences as experiences 2. Project as projects 3. Acheivements as acheivements. Note - You have to rewrite the content so it is different from the original content and every sentence should be in a new line. Return the data in the exact same format it will be provided, the same keys experiences, projects, acheivements should be reutrned every time. Do not rewrite the company name or project name or institute name. If you receive any empty array, return an empty array itself.",
      },
    });
    console.log(`Time took: ${(new Date() - startTime) / 1000} seconds`);
    const data = chatCompletion.text;
    if (data.includes("```json")) {
      return JSON.parse(data.split("```json")[1].split("```")[0]);
    }
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    throw new ExpressError("AI API Error", 500);
  }
};

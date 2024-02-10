import { openai } from '../index.js';
import ExpressError from './express-error.js';
import axios from 'axios';

export const extractKeywords = async job_description => {
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/transformer3/H1-keywordextractor',
    {
      inputs: job_description
    },
    {
      headers: {
        Authorization: 'Bearer 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'
      }
    }
  );
  const keywords = response.data.summary_text;
  return keywords;
};

export const rewriteDescriptions = async (description, job_description) => {
  return description;
  let new_description = description.join('. ');

  let prompt = '';
  if (job_description?.length) {
    // const keywords = await extractKeywords(job_description);

    prompt = `Please rewrite the following description and try to use the keywords that i have mentioned below. Generate three concise bullet points in about 15 to 20 words, separating each point with a new line. Write it in first person. Please only return the rewritten points:
    Description: "${new_description}".
    Job description: ${job_description}`;
    // prompt = `Please rewrite the following description and try to use the keywords that i have mentioned below. Generate three concise bullet points in about 15 to 20 words, separating each point with a new line. Write it in first person. Please only return the rewritten points:

    // Description:
    // ${new_description}

    // Keywords:
    // ${keywords}
    // `;
  } else {
    // prompt = `You are a resume writing expert and your task is to generate exactly 3 statements using the following description. You will get a plus point if you use metrices in the statement. Each statement should contain about 17 words. You can also add new statements if necessary maintaining the overall context and meaning. Use new line only for seperating sentences. Do not use full stop for seperating sentences. Please do not add any character before statements. Description: "${new_description}"`;
    prompt = `Please rewrite the following description for a professional resume. Write it in first person. Generate three concise bullet points in about 10 to 15 words, separating each point with a new line:

    Description:
    ${new_description}`;
  }

  try {
    console.log('hey hey*********************');
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 1000,
      temperature: 1,
      n: 1
    });
    console.log(response.data.choices?.[0]?.text);
    const response_description = response.data.choices?.[0]?.text
      ?.split(/\. |\n|;|\* |- |• /)
      ?.filter(desc => desc !== '' && desc.split(' ').length > 4)
      ?.map(desc => desc.trim())
      ?.slice(0, 3);
    return response_description;
  } catch (err) {
    console.log(err.response);
    throw new ExpressError('', 500);
  }
};

export const rewriteSentence = async (sentence, job_description) => {
  return sentence;
  let prompt = '';
  if (job_description?.length) {
    prompt = `You are expert at resume writing. Your task is to rewrite the sentence in about 10 to 15 words using the given job description. 
    Sentence: ${sentence}.
    Job description: ${job_description}
    `;
  } else {
    prompt = `You are expert at resume writing. Your task is to rewrite the sentence in about 10 to 15 words. Sentence: ${sentence}`;
  }
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 50,
      temperature: 1,
      n: 1
    });
    const resp = response.data.choices?.[0]?.text;
    return resp.split('\n').join('').trim();
  } catch (err) {
    console.log(err.response);
    throw new ExpressError('', 500);
  }
};

export const rewriteAchievements = async achievements => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `You are expert at content writing. Your task is to rewrite each sentence in about 15 words. Please seperate each sentence with a new line, it's most important. Sentences: ${achievements}`,
      max_tokens: 1000,
      temperature: 1,
      n: 1
    });
    const resp = response.data.choices?.[0]?.text
      ?.split(/\. |\n/)
      ?.filter(sent => sent !== '' && sent.length > 10)
      ?.map(desc => desc.trim());
    return resp;
  } catch (err) {
    console.log(err.response);
    throw new ExpressError('', 500);
  }
};

export const extractDataFromResume = async resume_text => {
  try {
    const startTime = new Date();
    console.log('Started...');
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            "You are an expert of data extraction from any text input. Your task is to extract relevant data from the resume text given to you. You need to return the output as an object in key value pairs. Start with name, email, phone number, city and state. Then for educations, each education should contain Institution name as institute_name, start year as start_year and end year as end_year and both must be numbers, scoring_type (must be either 'cgpa' or 'percentage'), maximum_score, score. Then for experiences, each experience must have company_name, position, mode which can be 'onsite', 'hybrid' or 'remote', location, start_date, end_date, then description. Then for projects, each project must contain Project name as name, skills_required (array of string), description. Then achievements as array of string. If any of the above is not mentioned add null in its position. Please be consistent in the key's name you give as it should be exactly same in every response and please give a valid json output. Also the description in experiences and projects should be array of string. experiences, educations and projects must be arrays."
        },
        {
          role: 'user',
          content: `This is the the resume text - ${resume_text}`
        }
      ],
      model: 'gpt-3.5-turbo'
    });
    console.log(`Time took: ${(new Date() - startTime) / 1000} seconds`);
    return JSON.parse(chatCompletion.choices[0].message.content);
  } catch (err) {
    console.log(err.response);
    throw new ExpressError('AI API Error', 500);
  }
};

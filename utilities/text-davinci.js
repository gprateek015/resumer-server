import { openai } from '../index.js';
import ExpressError from './express-error.js';

export const rewriteDescriptions = async description => {
  if (!description) return description;
  let new_description = description.join('. ');

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `You are a resume writing expert and your task is to generate 3 statements using the following description. You will get a plus point if you use metrices in the statement. Each statement should contain about 17 words. You can also add new statements if necessary maintaining the overall context and meaning. Seperate the statements using fullstops. Please do not prepend anything before statements. Description: ${new_description}`,
      max_tokens: 1000,
      temperature: 1,
      n: 1
    });
    const description = response.data.choices?.[0]?.text
      ?.split(/[.\n]+/)
      ?.filter(desc => desc !== '' && desc.length > 10)
      ?.map(desc => desc.trim())
      ?.slice(0, 3);
    return description;
  } catch (err) {
    console.log(err.response);
    throw new ExpressError('', 500);
  }
};

export const rewriteSentence = async sentence => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `You are expert at content writing. Your task is to rewrite the sentence in about 15 words. Sentence: ${sentence}`,
      max_tokens: 70,
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
      ?.split(/[\n]+/)
      ?.filter(sent => sent !== '' && sent.length > 10)
      ?.map(desc => desc.trim());
    return resp;
  } catch (err) {
    console.log(err.response);
    throw new ExpressError('', 500);
  }
};

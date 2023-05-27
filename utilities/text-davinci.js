import { openai } from '../index.js';
import ExpressError from './expressError.js';

export const rewriteDescriptions = async description => {
  let new_description = '';
  if (!description) return description;
  description.forEach(desc => {
    new_description += desc + '. ';
  });

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `You are a resume writing expert and your task is to generate 3 sentences using the following description. You will get a plus point if you use metrices in the sentence. Each sentence should contain about 17 words. You can also add new statements if necessary maintaining the overall context and meaning. Seperate the sentences using fullstops. Description: ${new_description}`,
      max_tokens: 150,
      temperature: 1,
      n: 1
    });
    const description = response.data.choices?.[0]?.text
      ?.split(/[.\n]+/)
      ?.filter(desc => desc !== '' && desc.length > 10)
      ?.map(desc => desc)
      ?.slice(0, 3);
    console.log(description);
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
    console.log(response.data.choices?.[0]?.text);
    return response.data.choices?.[0]?.text;
  } catch (err) {
    console.log(err.response);
    throw new ExpressError('', 500);
  }
};

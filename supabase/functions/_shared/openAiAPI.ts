// import { Configuration, OpenAIApi } from 'openai';

import { OpenAI } from 'https://deno.land/x/openai/mod.ts';

const openai = new OpenAI(Deno.env.get('OPENAPI_PRIVATE_KEY') ?? '');

const openaiWrapper = {
  createCompletion: async ({ prompt, engine, temperature = 1, maxTokens = 500, topP, frequencyPenalty, presencePenalty }:
    {
      prompt: string,
      engine: string,
      temperature: number,
      maxTokens: number,
      topP?: number,
      frequencyPenalty?: number,
      presencePenalty?: number
    }) => {
    return await openai.createCompletion(
    prompt,
    engine,
    temperature,
    maxTokens,
    topP,
    frequencyPenalty,
    presencePenalty,
    )
  }
}

// console.log(await instance.createCompletion('The meaning of life is'))

// const configuration = new Configuration({
//   apiKey: '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',
// });
// const openai = new OpenAIApi(configuration);

export const mealPromptRequest = async (prompt: string, temperature = 1) => {
  const response = await openaiWrapper.createCompletion({
    engine: "text-davinci-003",
    prompt: prompt,
    temperature,
    maxTokens: 1000,
  });
  
  return response;
}

export default mealPromptRequest;

// const response = await openai.createCompletion({
//   model: "text-davinci-003",
//   prompt: "What are some good names for a small computer programming consulting company? It should be professional and easy to remember.",
//   temperature: 1,
//   max_tokens: 500,
// });


// console.log(response);
// console.log(response.data);

// return response.data;
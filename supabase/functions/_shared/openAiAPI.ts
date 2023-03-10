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

export const mealPromptRequest = async (prompt: string, temperature = 1) => {
  const response = await openaiWrapper.createCompletion({
    engine: "text-davinci-003",
    prompt: prompt,
    temperature,
    maxTokens: 1000,
  });
  
  return response;
}

export const quickAsk = async (prompt: string, temperature = 1) => {
  const response = await openaiWrapper.createCompletion({
    engine: "text-davinci-003",
    prompt: prompt,
    temperature,
    maxTokens: 300,
  });
  
  return response;
}

export default mealPromptRequest;
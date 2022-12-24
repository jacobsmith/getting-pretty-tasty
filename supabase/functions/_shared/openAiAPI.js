import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: 'fill-me-in',
});
const openai = new OpenAIApi(configuration);
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "What are some good names for a small computer programming consulting company? It should be professional and easy to remember.",
  temperature: 1,
  max_tokens: 500,
});

console.log(response);
console.log(response.data);
import quickAsk from './openAiAPI.ts';

const quickAskWrapper = async (question: string, numberOfTries = 0) => {
  const quickAskPrompt = `
  You are a chef that can answer any question about food. You are in a kitchen and you are asked: "${question}"
`;

  const openAPIResponse = await quickAsk(quickAskPrompt);
  return openAPIResponse.choices[0].text;

}

export default quickAskWrapper;
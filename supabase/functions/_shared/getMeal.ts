import mealPromptRequest from './openAiAPI.ts';
import jsonic from "https://esm.sh/jsonic";

const getMeal = async (mealInput: string, numberOfTries = 0) => {
  const mealInputPrompt = `
  I will give you a prompt for a recipe. You will respond with the recipe and ingredients in JSON format.

Prompt: Give me a recipe and an ingredient list for a meal.
Response: {
  "meal_name": "Meal Name",
  "ingredients": [
    { "name": "ingredient 1", amount: "1 cup" },
    { "name": "ingredient 2", amount: "2 tablespoons" },
    { "name": "ingredient 3", amount: "amount" }
  ],
  "instructions": [
    "instruction 1",
    "instruction 2",
    "instruction 3"
  ]
}

Prompt: Give me a recipe and an ingredient list for a meal. ${mealInput}.
Response:
`;

  const openAPIResponse = await mealPromptRequest(mealInputPrompt);
  console.log(openAPIResponse);
  const mealOutput = openAPIResponse.choices[0].text;

  const funkyQuotes = /“|”/g;
  const funkySingleQuotes = /‘|’/g;
  let sanitizedMealOutput = mealOutput.replace(funkyQuotes, '"');
  sanitizedMealOutput = sanitizedMealOutput.replace(funkySingleQuotes, "'");

  try {
    return jsonic(sanitizedMealOutput);
  } catch (e) {
    if (numberOfTries < 3) {
      console.log('could not parse: ', sanitizedMealOutput);
      return getMeal(mealInput, numberOfTries + 1);
    }

    console.log(mealOutput, "could not parse as JSON");
    throw e;
  }

}

export default getMeal;
import mealPromptRequest from './openAiAPI.ts';
import jsonic from "https://esm.sh/jsonic";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const getMeal = async (mealInput: string, numberOfTries = 0) => {
  const mealInputPrompt = `
  I will give you a prompt for a recipe. You will respond with the recipe and ingredients in JSON format.

Prompt: Give me a recipe and an ingredient list for a meal.
Response: {
  "name": "Meal Name",
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

  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    // { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const openAPIResponse = await mealPromptRequest(mealInputPrompt);
  console.log(openAPIResponse);
  const mealOutput = openAPIResponse.choices[0].text;

  const funkyQuotes = /“|”/g;
  const funkySingleQuotes = /‘|’/g;
  let sanitizedMealOutput = mealOutput.replace(funkyQuotes, '"');
  sanitizedMealOutput = sanitizedMealOutput.replace(funkySingleQuotes, "'");

  try {
    const parsedMeal = jsonic(sanitizedMealOutput);

    const { data, error }= await supabaseClient.from('meals').insert(parsedMeal).select();
    if (error) { throw error; }

    return data[0];
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
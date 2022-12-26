// ask for meal input
// get GPT-3 response
// display GPT-3 response
//
// if user confirms meal
// add each ingredient to kroger cart

// start flow over again

import { confirm } from 'https://deno.land/x/inquirer/mod.ts';
import mealPromptRequest from './openAiAPI.ts';
import { krogerAPI } from './krogerAPI.ts';
import supabaseClient from './supabaseClient.ts';

// const mealInput = (await inquirer.prompt([
//   {
//     type: 'input',
//     name: 'meal',
//     message: 'What meal are you looking for?'
//   }
// ])).meal;

let mealInput = `
I want the output in JSON as follows:
{
  "meal_name": "Meal Name",
  "ingredients": [
    { name: "ingredient 1", amount: "amount" },
    { name: "ingredient 2", amount: "amount" },
    { name: "ingredient 3", amount: "amount" }
  ],
  "instructions": [
    "instruction 1",
    "instruction 2",
    "instruction 3"
  ]
}

Give me a recipe and an ingredient list for a meal that can serve 5 and has chicken and pasta.

Only include the JSON output.
`;
const openAPIResponse = await mealPromptRequest(mealInput);
const mealOutput = openAPIResponse.choices[0].text;

let parsedMealOutput = [];
try {
  parsedMealOutput = JSON.parse(mealOutput);
} catch (e) {
  console.log(mealOutput, "could not parse as JSON");
  throw e;
}


// ask if user wants to add meal to cart

const addToCart = (await confirm({
    message: 'Add these ingredients to your cart?'
}));

if (addToCart) {
  const westfieldKroger = '02100983';

  const { data, error } = await supabaseClient.from('user_access_tokens').select('*');

  if (error) {
    console.log('error: ', error);
    throw error;
  }

  const { access_token, refresh_token } = data[0];

  const userKroger = await krogerAPI.
    setLocation(westfieldKroger)
    .setUserTokens(access_token, refresh_token, 'jacob.wesley.smith@gmail.com')

  // add meal to cart
  parsedMealOutput.ingredients.forEach((ingredient: any) => {
    userKroger.addItemsToCart([{ upc: ingredient.upc, quantity: 1 }]);
  });
}

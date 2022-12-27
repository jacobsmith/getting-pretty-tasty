// ask for meal input
// get GPT-3 response
// display GPT-3 response
//
// if user confirms meal
// add each ingredient to kroger cart

// start flow over again

import { confirm, input } from 'https://deno.land/x/inquirer/mod.ts';
import mealPromptRequest from './openAiAPI.ts';
import { krogerAPI } from './krogerAPI.ts';
import supabaseClient from './supabaseClient.ts';
import jsonic from "https://esm.sh/jsonic";

const mealInput = (await input(
  { message: 'What meal are you looking for?' }
));

let mealInputPrompt = `
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

Prompt: Give me a recipe and an ingredient list for a meal that can serve 5. ${mealInput}.
Response:
`;
// temp remove so we can test kroger implementation
const openAPIResponse = await mealPromptRequest(mealInputPrompt);
const mealOutput = openAPIResponse.choices[0].text;

// console.log('mealOutput: ', mealOutput);

let parsedMealOutput = [];
try {
  parsedMealOutput = jsonic(mealOutput);
} catch (e) {
  console.log(mealOutput, "could not parse as JSON");
  throw e;
}

// ask if user wants to add meal to cart

console.log(parsedMealOutput);

const addToCart = (await confirm({
    message: 'Add these ingredients to your cart?'
}));

if (addToCart) {
  const westfieldKroger = '02100983';

  const { data, error } = await supabaseClient.from('user_access_tokens').select('*');
  // console.log(data);

  if (error) {
    console.log('error: ', error);
    throw error;
  }

  const { access_token, refresh_token } = data[0];

  const userKroger = await krogerAPI.
    setLocation(westfieldKroger)
    .setUserTokens(access_token, refresh_token, 'jacob.wesley.smith@gmail.com')

  // add meal to cart
  const products = await Promise.all(parsedMealOutput.ingredients.map(async (ingredient: any) => {

    const { data: products } = await userKroger.getProducts(ingredient.name);
    return products[0];
  }));

  // console.log('products: ', products);

  const productOptions = products.map((product) => {
    if (product.upc) {
      return { upc: product.upc, quantity: 1 };
    }

    return null;
  }).filter(x => x !== null);
  const itemsToCartResponse = await userKroger.addItemsToCart(productOptions);
  console.log(itemsToCartResponse);

}

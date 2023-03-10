import { config } from "https://deno.land/x/dotenv/mod.ts";
config();

import { krogerAPI } from "./krogerAPI.ts";
import supabaseClient from './supabaseClient.ts';

// krogerAPI.getLocations('46074').then((tokens) => {
//   console.log(tokens);
// });

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

// userKroger.getProducts('chicken');

const tysonChickenUPC = '0026082900000';

const response = await userKroger.addItemsToCart([{ upc: tysonChickenUPC, quantity: 1 }]);
console.log(response);

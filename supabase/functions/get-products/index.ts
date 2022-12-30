import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { krogerAPI } from '../_shared/krogerAPI.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

serve(async (req) => {
  const { method } = req;
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    // { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );

  const { ingredients } = await req.json();
  const westfieldKroger = '02100983';

  const { data, error } = await supabaseClient.from('user_access_tokens').select('*');

  if (error) {
    console.log('error: ', error);
    throw error;
  }

  const { access_token, refresh_token } = data[0];

  const userKroger = await krogerAPI.
    setLocation(westfieldKroger)
    .setUserTokens(access_token, refresh_token, 'jacob.wesley.smith@gmail.com');


  const products = await Promise.all(ingredients.map(async (ingredient) => {
    return {
      ingredient,
      products: await userKroger.getProducts(ingredient.name)
    };
  }));


  return new Response(
    JSON.stringify(products),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})
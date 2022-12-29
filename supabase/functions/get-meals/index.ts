// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import getMeal from "../_shared/getMeal.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

serve(async (req) => {
  const { method } = req;
  console.log('Method: ', method);
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

    const body = await req.json();

    const meal = await getMeal(body.mealPrompt);

  return new Response(
    JSON.stringify(meal),
    { headers: { "Content-Type": "application/json" } },
  )
})

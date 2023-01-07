// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import quickAskWrapper from '../_shared/quick_ask.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

serve(async (req) => {
  const { method } = req;
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { question } = await req.json();

  const answer = await quickAskWrapper(question);

  return new Response(
    JSON.stringify(answer),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { krogerAPI } from '../_shared/krogerAPI.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

serve(async (req) => {
  const { url, method } = req

  // This is needed if you're planning to invoke your function from a browser.
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const u=new URL(req.url);
    let params: { [key: string]: string } = {};
    for (const p of u.searchParams) {
      params[p[0]] = p[1];
    }

    if (params.code) {
      let user: any;
      console.log('params state: ', params.state, params);
      const { data: users } = await supabaseClient.from('users').select('*').eq('email', params.state);
      const existingUser = users[0];

      if (existingUser) {
        console.log('found user')
        user = existingUser;
      } else {
        const { data: { user: newUser }, error } = await supabaseClient.auth.signUp({ email: params.state, password: 'password' });

        let user = newUser;
        console.log('supabase client auth signup response: ', user, error);
      }

      const tokens = await krogerAPI.tradeCodeForTokens(params.code);

      console.log('got tokens: ', tokens);

      await supabaseClient.from('user_access_tokens').delete('*').eq('user_id', user.id);

      await supabaseClient.from('user_access_tokens').insert({
        user_id: user?.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
    }

    return Response.redirect('https://jacobsmith.github.io/getting-pretty-tasty?kroger_auth_success=true', 307);
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'


// curl -L -X POST 'https://htqvmfgbaqyytxxmlimh.functions.supabase.co/oauth?testing=params' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cXZtZmdiYXF5eXR4eG1saW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE0MDU5MDgsImV4cCI6MTk4Njk4MTkwOH0.lJaM59RP34vUZ7NREy_uX_luab6b7Je5i4Y3PqVB3LA' --data '{"name":"Functions"}'
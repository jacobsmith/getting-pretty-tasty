import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
  
const supabaseUrl = 'https://htqvmfgbaqyytxxmlimh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cXZtZmdiYXF5eXR4eG1saW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE0MDU5MDgsImV4cCI6MTk4Njk4MTkwOH0.lJaM59RP34vUZ7NREy_uX_luab6b7Je5i4Y3PqVB3LA';

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? supabaseUrl,
  Deno.env.get('SUPABASE_ANON_KEY') ?? supabaseAnonKey,
)

const updateKrogerTokensInSupabase = async (access_token: string, refresh_token: string, userEmail: string) => {
  if (access_token) {
    const { data, error } = await supabaseClient.from('users').select('*').eq('email', userEmail);

    console.log('refreshed token:', data);

    if (error) { throw error; }

    const user = data[0];

    await supabaseClient
      .from('user_access_tokens')
      .update({ refresh_token: refresh_token, access_token: access_token })
      .eq('email', userEmail);
  }
}

export { updateKrogerTokensInSupabase }

export default supabaseClient;
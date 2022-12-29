import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://htqvmfgbaqyytxxmlimh.supabase.co';
const supabasePublicKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cXZtZmdiYXF5eXR4eG1saW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE0MDU5MDgsImV4cCI6MTk4Njk4MTkwOH0.lJaM59RP34vUZ7NREy_uX_luab6b7Je5i4Y3PqVB3LA';
const supabase = createClient(supabaseUrl, supabasePublicKey);

const supabaseClient = {
  supabase,
  executeFunction: async (functionName, params) => {
    return await fetch('https://htqvmfgbaqyytxxmlimh.functions.supabase.co/' + functionName, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + supabasePublicKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
  },
}

export default supabaseClient;



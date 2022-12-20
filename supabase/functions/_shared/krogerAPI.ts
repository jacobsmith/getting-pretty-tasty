import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const redirect_uri = 'https://htqvmfgbaqyytxxmlimh.functions.supabase.co/oauth';
let apiUrl = 'https://api.kroger.com/v1/';
let authUrl = 'https://api.kroger.com/v1/connect/oauth2/authorize';
let tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
let locationsUrl = 'https://api.kroger.com/v1/locations';

class KrogerAPI {
  supabaseClient: SupabaseClient;
  krogerClientSecret: string | undefined;
  krogerClientId: string | undefined;

  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }

  async init() {
    this.krogerClientSecret = await this.clientSecret();
    this.krogerClientId = await this.clientId();
  }

  async clientSecret() {
    const { data, error } = await this.supabaseClient.from('secrets').select('*').eq('key', 'kroger-client-secret');
    if (error) throw error;
    const krogerClientSecret = data[0].value;

    return krogerClientSecret;
  }

  async clientId() {
    const { data, error } = await this.supabaseClient.from('secrets').select('*').eq('key', 'kroger-client-id');
    if (error) throw error;
    const krogerClientId = data[0].value;

    return krogerClientId;
  }

  basicAuthHeaderValue() {
    return btoa(this.krogerClientId + ':' + this.krogerClientSecret);
  }

  async tradeCodeForTokens(authCode: string) {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + this.basicAuthHeaderValue(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri
        })
      });

    const data = await response.json()
    console.log(data);
    return data;
  }
}
    
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)

const krogerAPI = new KrogerAPI(supabaseClient);

export { krogerAPI };
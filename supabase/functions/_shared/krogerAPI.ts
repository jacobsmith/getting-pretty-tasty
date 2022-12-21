import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

import { config } from 'https://deno.land/x/dotenv/mod.ts';
await config({export: true});

const redirect_uri = 'https://htqvmfgbaqyytxxmlimh.functions.supabase.co/oauth';
let apiUrl = 'https://api.kroger.com/v1/';
let authUrl = 'https://api.kroger.com/v1/connect/oauth2/authorize';
let tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
let locationsUrl = 'https://api.kroger.com/v1/locations';

class KrogerAPI {
  supabaseClient: SupabaseClient;
  krogerClientSecret: string | undefined;
  krogerClientId: string | undefined;
  appAccessToken: string | undefined;

  constructor(supabaseClient: SupabaseClient, krogerClientSecret: string | undefined, krogerClientId: string | undefined, appAccessToken: string | undefined) {
    this.supabaseClient = supabaseClient;
    this.krogerClientSecret = krogerClientSecret;
    this.krogerClientId = krogerClientId;
    this.appAccessToken = appAccessToken;
  }

  static async init(supabaseClient: SupabaseClient) {
    const krogerClientSecret = await this.clientSecret(supabaseClient);
    const krogerClientId = await this.clientId(supabaseClient);
    const appAccessToken = await this.getAppToken(krogerClientId, krogerClientSecret);

    return new KrogerAPI(supabaseClient, krogerClientSecret, krogerClientId, appAccessToken);
  }

  static async clientSecret(supabaseClient: SupabaseClient) {
    const { data, error } = await supabaseClient.from('secrets').select('*').eq('key', 'kroger-client-secret');
    if (error) throw error;
    const krogerClientSecret = data[0].value;
    return krogerClientSecret;
  }

  static async clientId(supabaseClient: SupabaseClient) {
    const { data, error } = await supabaseClient.from('secrets').select('*').eq('key', 'kroger-client-id');
    if (error) throw error;
    const krogerClientId = data[0].value;
    return krogerClientId;
  }

  static basicAuthHeaderValue(krogerClientId, krogerClientSecret) {
    return btoa(krogerClientId + ':' + krogerClientSecret);
  }

  async tradeCodeForTokens(authCode: string) {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + KrogerAPI.basicAuthHeaderValue(this.krogerClientId, this.krogerClientSecret),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri
        })
      });

    const data = await response.json()
    return data;
  }

  static async getAppToken(krogerClientId, krogerClientSecret) {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + this.basicAuthHeaderValue(krogerClientId, krogerClientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'product.compact'
      })
    });

    const data = await response.json();
    return data.access_token;
  }

  async getLocations(zipCode: string) {
    let response = await fetch(locationsUrl + '?filter.zipCode.near=' + zipCode, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.appAccessToken}`
      }
    });
    let data = await response.json();
    console.log(data);
  }
}
    
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)

const krogerAPI = await KrogerAPI.init(supabaseClient);

export { krogerAPI };
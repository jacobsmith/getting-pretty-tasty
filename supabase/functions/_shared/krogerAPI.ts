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

  constructor(supabaseClient: SupabaseClient, krogerClientSecret: string | undefined, krogerClientId: string | undefined) {
    this.supabaseClient = supabaseClient;
    this.krogerClientSecret = krogerClientSecret;
    this.krogerClientId = krogerClientId;
  }

  static async init(supabaseClient: SupabaseClient) {
    const krogerClientSecret = await this.clientSecret(supabaseClient);
    const krogerClientId = await this.clientId(supabaseClient);

    return new KrogerAPI(supabaseClient, krogerClientSecret, krogerClientId);
  }

  static async clientSecret(supabaseClient: SupabaseClient) {
    const { data, error } = await supabaseClient.from('secrets').select('*').eq('key', 'kroger-client-secret');
    if (error) throw error;

    console.log('client secret: ', data[0].value)

    const krogerClientSecret = data[0].value;

    return krogerClientSecret;
  }

  static async clientId(supabaseClient: SupabaseClient) {
    const { data, error } = await supabaseClient.from('secrets').select('*').eq('key', 'kroger-client-id');
    if (error) throw error;
    const krogerClientId = data[0].value;

    console.log('client id: ', krogerClientId)

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
    return data;
  }

  async getAppTokens() {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + this.basicAuthHeaderValue(),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'product.compact'
      })
    });

    const data = await response.json()
    return data;
  }

  async getLocations(zipCode: string) {
    let response = await fetch(locationsUrl + '?filter.zipCode.near=' + zipCode, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jacobTokens.access_token}`
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
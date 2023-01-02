// import { config } from 'https://deno.land/x/dotenv/mod.ts';
import supabaseClient from './supabaseClient.ts';
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { updateKrogerTokensInSupabase } from './supabaseClient.ts';
// await config({export: true});

const redirect_uri = 'https://htqvmfgbaqyytxxmlimh.functions.supabase.co/oauth';
let apiUrl = 'https://api.kroger.com/v1/';
let authUrl = 'https://api.kroger.com/v1/connect/oauth2/authorize';
let tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
let locationsUrl = 'https://api.kroger.com/v1/locations';
let cartUrl = 'https://api.kroger.com/v1/cart/add';
const productsUrl = 'https://api.kroger.com/v1/products';

class KrogerAPI {
  supabaseClient: SupabaseClient;
  krogerClientSecret: string;
  krogerClientId: string;
  appAccessToken: string | undefined;
  locationId?: string;
  userAccessToken?: string;
  userRefreshToken?: string;
  userEmail?: string;

  constructor(supabaseClient: SupabaseClient, krogerClientSecret: string, krogerClientId: string, appAccessToken: string | undefined) {
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

  static basicAuthHeaderValue(krogerClientId: string, krogerClientSecret: string) {
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

    console.log(response);

    const data = await response.json()
    return data;
  }

  async refreshTokens() {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + KrogerAPI.basicAuthHeaderValue(this.krogerClientId, this.krogerClientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.userRefreshToken
      } as any)
    });

    const data = await response.json()

    if (data.access_token) {
      this.userAccessToken = data.access_token;
      this.userRefreshToken = data.refresh_token;
    }
    return data;
  }

  static async getAppToken(krogerClientId: string, krogerClientSecret: string) {
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

  setLocation(locationId: string) {
    this.locationId = locationId;
    return this;
  }

  setUserTokens(accessToken: string, refreshToken: string, userEmail: string) {
    this.userAccessToken = accessToken;
    this.userRefreshToken = refreshToken;
    this.userEmail = userEmail;
    return this;
  }

  async getProducts(term: string) {
    let response = await fetch(productsUrl + '?filter.locationId=' + this.locationId + '&filter.term=' + term, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.appAccessToken}`
      }
    });
    let data = await response.json();

    return data;
  }

  async addItemsToCart(items: any[], attempt = 0) {
    let response = await fetch(cartUrl, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.userAccessToken}`
      },
      body: JSON.stringify({ items: items })
    });

    if (response.ok) {
      return { success: true, error: null }
    }

    if (response.status === 401) {
      if (attempt === 2) return { success: false, error: response }
      console.log('unauthorized, refreshing token');
      const refreshTokenResponse = await this.refreshTokens();
      console.log("🚀 ~ file: krogerAPI.ts:167 ~ KrogerAPI ~ addItemsToCart ~ refreshTokenResponse", refreshTokenResponse)
      await updateKrogerTokensInSupabase(refreshTokenResponse.access_token, refreshTokenResponse.refresh_token, this.userEmail || '');
      return this.addItemsToCart(items, attempt + 1);
    }
    
    return { success: false, error: response }
  }
}
    
const krogerAPI = await KrogerAPI.init(supabaseClient);

export { krogerAPI };
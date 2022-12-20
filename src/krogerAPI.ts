const redirect_uri = 'https://htqvmfgbaqyytxxmlimh.functions.supabase.co/oauth';

class KrogerAPI {
  krogerClientSecret: string;
  krogerClientId: string;

  constructor(supabaseClient) {
    this.supabaseClient = supabaseClient;
    krogerClientSecret = await this.clientSecret();
    krogerClientId = await this.clientId();
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
    (async () => {
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

      response.json().then(data => {
        console.log(data);
        return data;
      });
    })();

  }
}
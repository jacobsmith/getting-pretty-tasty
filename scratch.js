import fetch from 'node-fetch';

let apiUrl = 'https://api.kroger.com/v1/';
let authUrl = 'https://api.kroger.com/v1/connect/oauth2/authorize';
let tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
let locationsUrl = 'https://api.kroger.com/v1/locations';

let client_id = 'getsprettytasty-6fe79c7e664cd43d0c322ee1465ec5697471146573710013139';
let response_type = 'code';
let redirect_uri = 'https://htqvmfgbaqyytxxmlimh.functions.supabase.co/oauth';
let scope = 'cart.basic:write';

let fullAuthUrl = authUrl + '?' +
  'client_id=' + client_id + '&' +
  'response_type=' + response_type + '&' +
  'redirect_uri=' + redirect_uri + '&' + 
  'scope=' + scope + '&' +
  'state=jacob.wesley.smith@gmail.com';

  console.log(fullAuthUrl);

// Step 1. User hits the fullAuthUrl above
// Step 2. We get back at /oauth the state/code
// Step 3. We send a POST request to the token url with the received code and trade that for tokens
// Step 4. We get a refresh token and access tokens

// const userCodeJacob = 'code-from-auth-process';

// const krogerClientSecret = 'client-secret';
// const krogerClientId = 'getsprettytasty-6fe79c7e664cd43d0c322ee1465ec5697471146573710013139';

// const base64ClientIdClientSecret = btoa(krogerClientId + ':' + krogerClientSecret);

// (async () => {
//   const response = await fetch(tokenUrl, {
//     method: 'POST',
//     headers: {
//       Authorization: 'Basic ' + base64ClientIdClientSecret,
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: new URLSearchParams({
//       grant_type: 'authorization_code',
//       code: userCodeJacob,
//       redirect_uri
//     })
//   });

//   response.json().then(data => {
//     console.log(data);
//   });
// })();

const jacobTokens = {
};

// (async () => {
//   const response = await fetch(tokenUrl, {
//     method: 'POST',
//     headers: {
//       Authorization: 'Basic ' + base64ClientIdClientSecret,
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: new URLSearchParams({
//       grant_type: 'refresh_token',
//       refresh_token: jacobTokens.refresh_token,
//       redirect_uri
//     })
//   });

//   response.json().then(data => {
//     console.log(data);
//   });
// })();
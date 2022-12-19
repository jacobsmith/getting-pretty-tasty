import fetch from 'node-fetch';

let apiUrl = 'https://api.kroger.com/v1/';
let authUrl = 'https://api.kroger.com/v1/connect/oauth2/authorize';
let tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
let locationsUrl = 'https://api.kroger.com/v1/locations';
let productSearchUrl = "https://api.kroger.com/v1/products";

const jacobTokens = {
};

const westfieldKroger = '02100983';

(async() => {
  let response = await fetch(locationsUrl + '?filter.zipCode.near=46074', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jacobTokens.access_token}`
    }
  });
  let data = await response.json();
  console.log(data);
})()

// (async() => {
//   let response = await fetch(productSearchUrl + '?filter.term=bread&filter.locationId=' + westfieldKroger, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${jacobTokens.access_token}`
//     }
//   });
//   let data = await response.json();
//   console.log(data);
// })()


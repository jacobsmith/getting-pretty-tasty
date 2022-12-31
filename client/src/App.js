import { useState } from 'react';
import './App.css';
import supabaseClient from './clientSupabase.js';

function App() {
  const [query, setQuery] = useState('');
  const [meal, setMeal] = useState('');
  const [log, setLog] = useState([]);

  const fetchMeal = async () => {
    setLog(l => [...l, 'fetchMeal called'])
    let response;
    try {
     response = await supabaseClient.executeFunction('get-meals', { mealPrompt: query });
    } catch (e) {
      setLog(l => [...l, e.message])
      setLog(l => [...l, e.trace])
    }
    setLog(l => [...l, response]);

    setMeal(response.data);
  }

  let authUrl = 'https://api.kroger.com/v1/connect/oauth2/authorize';
  let client_id = 'getsprettytasty-6fe79c7e664cd43d0c322ee1465ec5697471146573710013139';
  let response_type = 'code';
  let redirect_uri = 'https://htqvmfgbaqyytxxmlimh.functions.supabase.co/oauth';
  let scope = 'cart.basic:write';

  const authenticateWithKroger = authUrl + '?' +
    'client_id=' + client_id + '&' +
    'response_type=' + response_type + '&' +
    'redirect_uri=' + redirect_uri + '&' +
    'scope=' + scope + '&' +
    'state=jacob.wesley.smith@gmail.com';

  return (
    <div className="App">
      <a href={ authenticateWithKroger }>Authenticate With Kroger</a>
      <div className="text-red-500">I'm looking for meals that...</div>
      <input value={ query } onChange={ (e) => setQuery(e.target.value) } />
      <button onClick={ fetchMeal }>Search</button>

      <pre>{ JSON.stringify(meal) }</pre>

      {
        log.map((l, i) => <div key={ i }>{ JSON.stringify(l) }</div>)
      }
    </div>
  );
}

export default App;

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


  return (
    <div className="App">
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

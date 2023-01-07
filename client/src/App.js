import { useEffect, useState } from 'react';
import './App.css';
import supabaseClient from './clientSupabase.js';
import Meal from './components/meal';
import Menu from './components/menu';
import MenuDisplay from './components/menuDisplay';
import QuickAsk from './QuickAsk';

function App() {
  const [query, setQuery] = useState('');
  const [meal, setMeal] = useState();
  const [allMeals, setAllMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeal = async () => {
    setLoading(true);
    updateAllMeals();
    const response = await supabaseClient.executeFunction('get-meals', { mealPrompt: query });
    setMeal(response);
    setLoading(false);
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
  
  const updateAllMeals = () => {
    (async() => {
      const { data, error } = await supabaseClient.supabase.from('meals').select('*');

      if (!error) {
        setAllMeals(data);
      }
    })();
  }

  useEffect(() => {
    updateAllMeals();
  }, []);

  // TODO:
  // 1. ability to remove ingredients from the products to buy
  // 2. ability to add ingredients to the products to buy
  // 3. ability to change quantity of ingredients to buy
  // 4. ability to "modify" a meal with natural language 

  return (
    <div className="App">
      <Menu>
        <a href={ authenticateWithKroger } target="_blank">Authenticate With Kroger</a>
        <QuickAsk />
        <MenuDisplay />
        <div className="text-red-500">I'm looking for meals that...</div>
        <input value={ query } onChange={ (e) => setQuery(e.target.value) } />
        <button onClick={ fetchMeal }>Search</button>

        { loading && <div>Going to the ends of the earth to find the perfect dish for you! Hang on, it can take 10-20 seconds. The ends of the earth are kinda far away...</div>}

        { !loading && meal && <Meal meal={ meal } /> }


        <div className='flex flex-wrap justify-center'>
          { allMeals.map(meal => <Meal meal={ meal } collapsed={ true } />) }
        </div>
      </Menu>
    </div>
  );
}

export default App;

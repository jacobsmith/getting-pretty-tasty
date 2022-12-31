import { useEffect, useState } from 'react';
import './App.css';
import supabaseClient from './clientSupabase.js';
import Meal from './components/meal';
import Menu from './components/menu';
import MenuDisplay from './components/menuDisplay';

function App() {
  const [query, setQuery] = useState('');
  const [meal, setMeal] = useState({"meal_name":"Lasagna","ingredients":[{"name":"ground beef","amount":"1 lb"},{"name":"pasta sauce","amount":"1 jar"},{"name":"lasagna noodles","amount":"1 box"},{"name":"shredded mozzarella cheese","amount":"2 cups"},{"name":"ricotta cheese","amount":"1 cup"},{"name":"grated Parmesan cheese","amount":"1/2 cup"}],"instructions":["Preheat oven to 350°F. In a large skillet, heat ground beef over medium heat until browned.","Drain off fat.","Mix in pasta sauce.","In the bottom of a 9x13 inch baking dish, spread a small amount of meat sauce.","Layer with three uncooked lasagna noodles and a little more than half of the ricotta cheese; sprinkle with some mozzarella and Parmesan cheese.","Repeat layers, and top with remaining mozzarella and Parmesan cheeses.","Bake at 350°F for 30 minutes. Let stand 10 minutes before serving."]});
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

  return (
    <div className="App">
      <Menu>
        <a href={ authenticateWithKroger } target="_blank">Authenticate With Kroger</a>
        <MenuDisplay />
        <div className="text-red-500">I'm looking for meals that...</div>
        <input value={ query } onChange={ (e) => setQuery(e.target.value) } />
        <button onClick={ fetchMeal }>Search</button>

        { loading && <div>Going to the ends of the earth to find the perfect dish for you! Hang on, it can take 10-20 seconds. The ends of the earth are kinda far away...</div>}

        { !loading && <Meal meal={ meal } /> }

        <div className='flex flex-wrap'>
          { allMeals.map(meal => <Meal meal={ meal } />) }
        </div>
      </Menu>
    </div>
  );
}

export default App;

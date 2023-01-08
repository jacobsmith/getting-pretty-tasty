import { useEffect, useState } from 'react';
import supabaseClient from './clientSupabase';
import Meal from './components/meal';
import Menu from './components/menu';
import MenuDisplay from './components/menuDisplay';
import QuickAsk from './QuickAsk';

const Dashboard = () => {
  const [query, setQuery] = useState('');
  const [meal, setMeal] = useState();
  const [allMeals, setAllMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [krogerAuthUrl, setKroggerAuthUrl] = useState('');
 
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseClient.supabase.auth.getUser();
      if (user) {
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
          `state=${user.email}`;

        setKroggerAuthUrl(authenticateWithKroger);
      }
    })();
  }, []);

  
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

    const params = new URLSearchParams(window.location.search)
    if (params.get('kroger_auth_success') === 'true') {
      alert('You have successfully authenticated with Kroger!');
      params.delete('kroger_auth_success');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchMeal = async () => {
    setLoading(true);
    updateAllMeals();
    const response = await supabaseClient.executeFunction('get-meals', { mealPrompt: query });
    setMeal(response);
    setLoading(false);
  }
  
  return (
      <Menu>
        <a href={ krogerAuthUrl } target="_blank">Authenticate With Kroger</a>

        <QuickAsk />
        <MenuDisplay />

        <div className='h-[50vh] flex justify-center items-center flex-col'>
          <div>
            <input value={ query } onChange={ (e) => setQuery(e.target.value) } className="w-64 p-2 rounded" placeholder='My perfect meal is...' />
          </div>
          <div>
            <button onClick={ fetchMeal } className="bg-green-100 cursor-pointer hover:bg-green-200 p-2 rounded m-2">Find my perfect meal</button>
          </div>
        </div>

        { loading && <div>Going to the ends of the earth to find the perfect dish for you! Hang on, it can take 10-20 seconds. The ends of the earth are kinda far away...</div>}

        { !loading && meal && <Meal meal={ meal } /> }

        <div>Or check out the premade dishes below</div>
        <hr />

        <div className='flex flex-wrap justify-center'>
          { allMeals.map(meal => <Meal meal={ meal } collapsed={ true } />) }
        </div>
      </Menu>
  );
}

export default Dashboard;
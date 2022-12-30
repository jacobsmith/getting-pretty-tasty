import { useState } from 'react';
import './App.css';
import supabaseClient from './clientSupabase.js';
import Meal from './components/meal';
import Menu from './components/menu';
import MenuDisplay from './components/menuDisplay';

function App() {
  const [query, setQuery] = useState('');
  const [meal, setMeal] = useState({"meal_name":"Lasagna","ingredients":[{"name":"ground beef","amount":"1 lb"},{"name":"pasta sauce","amount":"1 jar"},{"name":"lasagna noodles","amount":"1 box"},{"name":"shredded mozzarella cheese","amount":"2 cups"},{"name":"ricotta cheese","amount":"1 cup"},{"name":"grated Parmesan cheese","amount":"1/2 cup"}],"instructions":["Preheat oven to 350°F. In a large skillet, heat ground beef over medium heat until browned.","Drain off fat.","Mix in pasta sauce.","In the bottom of a 9x13 inch baking dish, spread a small amount of meat sauce.","Layer with three uncooked lasagna noodles and a little more than half of the ricotta cheese; sprinkle with some mozzarella and Parmesan cheese.","Repeat layers, and top with remaining mozzarella and Parmesan cheeses.","Bake at 350°F for 30 minutes. Let stand 10 minutes before serving."]});

  const fetchMeal = async () => {
    const response = await supabaseClient.executeFunction('get-meals', { mealPrompt: query });

    setMeal(response);
  }

  return (
    <div className="App">
      <Menu>
        <MenuDisplay />
        <div className="text-red-500">I'm looking for meals that...</div>
        <input value={ query } onChange={ (e) => setQuery(e.target.value) } />
        <button onClick={ fetchMeal }>Search</button>

        <Meal meal={ meal } />
      </Menu>
    </div>
  );
}

export default App;

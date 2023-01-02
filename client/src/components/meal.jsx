import React, { useContext, useState } from "react";
import { MenuContext } from "./menu";

// type MealType = {
//   meal_name: string;
//   ingredients: string[];
//   instructions: string[];
// }

const Meal = ({ meal, collapsed = false }) => {
  const { addMeal, removeMeal, mealInMenu } = useContext(MenuContext);
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  return (
    <div className={ "text-left bg-slate-200 p-4 m-4 md:w-1/3 lg:w-1/5" } >
      <h1 className="text-xl">{meal.name}</h1>

      {
        mealInMenu(meal) ? (
          <button className="bg-blue-400 p-2 text-white" onClick={ () => removeMeal(meal) }>Remove from Menu</button>
        ) : (
          <button className="bg-blue-400 p-2 text-white" onClick={ () => addMeal(meal) }>Add to Menu</button>
        )
      }

      <div onClick={ () => setIsCollapsed(s => !s)}>
        <h3 className="mt-8">Ingredients</h3>
        <ul>
          { meal.ingredients.map((ingredient, index) => (
            <li key={ index }>{ ingredient.name } - { ingredient.amount }</li>
          )) }
        </ul>

        <div className={ isCollapsed ? 'hidden' : '' }>
          <h2 className="mt-8">Instructions</h2>
          <ol>
            { meal.instructions.map((instruction, index) => (
              <li key={ index }>{ instruction }</li>
            )) }
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Meal;
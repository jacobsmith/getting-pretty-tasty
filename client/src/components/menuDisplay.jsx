import { useContext, useState } from "react";
import { MenuContext } from "./menu";

const MenuDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { menu } = useContext(MenuContext);

  const allIngredients = menu.reduce((acc, meal) => {
    meal.ingredients.forEach(ingredient => {
      const existingIngredient = acc.find(i => i.name === ingredient.name);
      if (existingIngredient) {
        existingIngredient.amount += ingredient.amount;
      } else {
        acc.push(ingredient);
      }
    });

    return acc;
  }, []);

  console.log('allIngredients: ', allIngredients);

  return (
    <>
      <div onClick={ () => setIsOpen(o => !o) }>Current Meals: { menu && menu.length }</div>
      { isOpen && (

        <div className="text-left bg-slate-200 p-4 m-4 md:w-1/3 lg:w-1/5">
          <h1 className="text-xl">Menu</h1>
          <ul>
            {menu.map((meal, index) => (
              <li key={'meal: ' + index}>{meal.name}</li>
            ))}
          </ul>

          <hr className="h-1 bg-black" />

          <ul>
            {
            allIngredients.map((ingredient, index) => (
              <li key={'ingredient: ' + index}>{ingredient.name} - { ingredient.amount }</li>
            ))
            }
          </ul>
        </div>
      )}
    </>
  )
};

export default MenuDisplay;
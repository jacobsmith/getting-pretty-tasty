import { useContext, useState } from "react";
import supabaseClient from "../clientSupabase";
import ChooseProduct from "./chooseProduct";
import krogerResponse from "./krogerResponse";
import { MenuContext } from "./menu";

const MenuDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [krogerProducts, setKrogerProducts] = useState([]);

  const { menu, selectedProducts, setSelectedProducts } = useContext(MenuContext);

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

  const fetchKrogerProducts = async () => {
    const response = await supabaseClient.executeFunction('get-products', { ingredients: allIngredients });
 
    setKrogerProducts(response);
    response.forEach((datum) => {
      setSelectedProducts(s => { return { ...s, [datum.ingredient.name]: datum.products.data[0] }});
    });
  }

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

          <button onClick={ fetchKrogerProducts }>Fetch Kroger Products</button>

          <hr className="h-1 bg-black" />

          <ul>
            {
              allIngredients.map((ingredient) => (
                <ChooseProduct ingredient={ingredient} products={ krogerProducts.find(x => x.ingredient.name === ingredient.name)?.products?.data }/>
              ))
            }
          </ul>
        </div>
      )}
    </>
  )
};

export default MenuDisplay;
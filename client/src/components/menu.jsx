import React, { useEffect, useState } from 'react';
import { md5 } from './localStorage';

const MenuContext = React.createContext({});

export { MenuContext };

let parsedMenu = [];
if (localStorage.getItem('menu')) {
  const menu = JSON.parse(localStorage.getItem('menu'));
  if (menu && Array.isArray(menu)) {
    parsedMenu = menu;
  }
}


const Menu = ({ children }) => {
  const [menu, setMenu] = React.useState(parsedMenu);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [allIngredients, setAllIngredients] = useState([]);

  const addMeal = (meal) => {
    setMenu([...menu, meal]);
    localStorage.setItem('menu', JSON.stringify([...menu, meal]));
  }

  const removeMeal = (meal) => {
    setMenu(menu.filter((m) => m.id !== meal.id));
    setTimeout(() => {
      localStorage.setItem('menu', JSON.stringify([...menu]));
    }, 1000);
  }

  const mealInMenu = (meal) => {
    return menu && menu.find((m) => m.id === meal.id);
  }

  const toggleIngredient = (ingredient) => {
    const updatedIngredients = [...allIngredients];
    updatedIngredients.forEach((i) => {
      if (i.name === ingredient.name) {
        i.doNotPurchase = !i.doNotPurchase;
      }
    });

    setAllIngredients(updatedIngredients);
  }

  useEffect(() => {
    const parsedIngredients = menu.reduce((acc, meal) => {
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

    setAllIngredients(parsedIngredients);
  }, [menu]);

  const addCustomIngredient = (ingredient) => {
    const updatedIngredients = [...allIngredients];
    updatedIngredients.push({ name: ingredient });
    setAllIngredients(updatedIngredients);
  }

  const purchasingIngredients = allIngredients.filter((i) => !i.doNotPurchase);

  return (
    <MenuContext.Provider value={{ addMeal, removeMeal, mealInMenu, menu, selectedProducts, setSelectedProducts, allIngredients, toggleIngredient, purchasingIngredients, addCustomIngredient }}>
      {children}
    </MenuContext.Provider>
  );
}

export default Menu;
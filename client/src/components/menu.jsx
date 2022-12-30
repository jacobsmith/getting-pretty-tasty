import React, { useState } from 'react';
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

  return (
    <MenuContext.Provider value={{ addMeal, removeMeal, mealInMenu, menu, selectedProducts, setSelectedProducts }}>
      {children}
    </MenuContext.Provider>
  );
}

export default Menu;
import React from 'react';
import { md5 } from './localStorage';

const MenuContext = React.createContext({});

export { MenuContext };

const Menu = ({ children }) => {
  const [menu, setMenu] = React.useState([]);

  const addMeal = (meal) => {
    setMenu([...menu, meal]);
  }

  const removeMeal = (meal) => {
    setMenu(menu.filter((m) => m.id !== meal.id));
  }

  const mealInMenu = (meal) => {
    console.log('meal in menu');
    return menu.find((m) => m.id === meal.id);
  }

  return (
    <MenuContext.Provider value={{ addMeal, removeMeal, mealInMenu, menu }}>
      {children}
    </MenuContext.Provider>
  );
}

export default Menu;
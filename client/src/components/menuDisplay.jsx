import { useContext } from "react";
import { MenuContext } from "./menu";

const MenuDisplay = () => {
  const { menu } = useContext(MenuContext);

  return (
    <div>Current Meals: { menu.length }</div>
  )
};

export default MenuDisplay;
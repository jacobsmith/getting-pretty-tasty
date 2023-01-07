import React from "react";
import { MenuContext } from "./menu";

const ChooseProduct = ({ ingredient, products }) => {
  const { selectedProducts, setSelectedProducts } = React.useContext(MenuContext);
  const [showOptions, setShowOptions] = React.useState(false);

  const toggleDetails = () => {
    setShowOptions(s => !s)
  }

  const handleSelectProduct = (product) => {
    setSelectedProducts(s => { return { ...s, [ingredient.name]: product } });
  }

  const handleSelectProductQuantity = (quantity) => {
    setSelectedProducts(s => { return { ...s, [ingredient.name]: { ...s[ingredient.name], quantity: Number(quantity) } } });
  }

  const selectedProduct = products && products.find((product) => product.upc === selectedProducts[ingredient.name]?.upc);

  return (
    <div>
      <div onClick={ toggleDetails }>
        <h1>{ ingredient.name }</h1>
        <div>
          {
            showOptions ?
              (
                <div>
                  { products && products.map((product, index) => (
                    <div onClick={ () => handleSelectProduct(product) }>
                      { selectedProducts[ingredient.name]?.upc === product.upc && (
                        <div>SELECTED</div>
                      ) }
                      <div key={ 'product: ' + index }>{ product.description }</div>
                      <div>{ product.items[0].price?.promo || product.items[0].price?.regular }</div>
                      <img src={ product.images[0].sizes[2].url } />
                    </div>
                  )) }
                </div>
              ) :
              (
                selectedProduct && (
                  <>
                    <div key={ 'selectedproduct' }>{ selectedProduct.description }</div>
                    <div>{ selectedProduct.items[0].price?.promo || selectedProduct.items[0].price?.regular || 'No price found' }</div>
                    <img src={ selectedProduct.images[0].sizes[2].url } />
                  </>
                )
              )
          }



        </div>
      </div>
      {
        selectedProduct && (
          <label>
            Quantity:
            <select onChange={ (e) => handleSelectProductQuantity(e.target.value) }>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
          </label>

        )
      }
  </div>
  )
};

export default ChooseProduct;
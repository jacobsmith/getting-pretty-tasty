import React, { useEffect } from "react";
import { MenuContext } from "./menu";

const ChooseProduct = ({ ingredient, products }) => {
  const { selectedProducts, setSelectedProducts } = React.useContext(MenuContext);
  const [showOptions, setShowOptions] = React.useState(false);

  const toggleDetails = () => {
    setShowOptions(s => !s)
  }

  const handleSelectProduct = (product) => {
    setSelectedProducts(s => { return { ...s, [ingredient.name]: product }});
  }

  const selectedProduct = products && products.find((product) => product.upc === selectedProducts[ingredient.name]?.upc);

  return (
  <div onClick={ toggleDetails }>
    <h1>{ingredient.name}</h1>
    <div>
      {
        showOptions ?
        (
          <div>
            {products && products.map((product, index) => (
              <div onClick={ () => handleSelectProduct(product)}>
                { selectedProducts[ingredient.name]?.upc === product.upc && (
                  <div>SELECTED</div>
                )}
                <div key={'product: ' + index}>{product.description}</div>
                <div>{product.items[0].price.promo || product.items[0].price.regular}</div>
                <img src={ product.images[0].sizes[2].url} />
              </div> 
            ))}
          </div>
        ) :
        (
          selectedProduct && (
            <>
              <div key={'selectedproduct'}>{selectedProduct.description}</div>
              <div>{ selectedProduct.items[0].price?.promo || selectedProduct.items[0].price?.regular || 'No price found' }</div>
              <img src={ selectedProduct.images[0].sizes[2].url} />
            </>
          )
        )
      }
      

    </div>
  </div>
  )
};

export default ChooseProduct;
import React, { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import Card from "../Card/Card.jsx";
import "./Collection.css";

const Collection = () => {
  const { products } = useContext(ShopContext);

  // Take first 7 products
  const featuredProducts = products.slice(0, 7);

  return (
    <section className="collection">
      <h2 className="collection-title">Featured Collection</h2>
      <div className="collection-grid">
        {featuredProducts.map((product, index) => (
          <Card
            key={index}
            name={product.name}
            price={product.price}
            desc={product.desc}
            category={product.category}
            image={product.images[0]} // first image
          />
        ))}
      </div>
    </section>
  );
};

export default Collection;

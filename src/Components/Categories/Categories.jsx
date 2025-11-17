import React from "react";
import "./Categories.css";
import {assets} from "../../assets/asssets.js"

const categories = [
  { 
    name: "Shoes", 
    image: assets.shoes
  },
  { 
    name: "Jacket", 
    image: assets.jacket
  },
  { 
    name: "Hoodie", 
    image: assets.hoodie
  },
  { 
    name: "T-shirts", 
    image: assets.shirt
  },
];

const Categories = () => {
  return (
    <section className="categories">
      <h2 className="categories-title">Shop by Category</h2>
      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div className="category-card" key={index}>
            <img src={cat.image} alt={cat.name} className="category-image" />
            <div className="category-info">
              <h3>{cat.name}</h3>
              <button className="btn-category">Shop Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;

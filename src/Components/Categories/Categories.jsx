import React from "react";
import "./Categories.css";
import { assets } from "../../assets/asssets.js";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "shoe", image: assets.shoes },
  { name: "Jacket", image: assets.jacket },
  { name: "Hoodie", image: assets.hoodie },
  { name: "T-shirts", image: assets.shirt }, // kept your original spelling
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="categories">
      <h2 className="categories-title">Shop by Category</h2>
      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div
            className="category-card"
            key={index}
            onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/category/${encodeURIComponent(cat.name)}`)}
          >
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

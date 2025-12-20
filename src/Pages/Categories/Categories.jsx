import React from "react";
import "./Categories.css";
import { assets } from "../../assets/asssets.js";
import { useNavigate } from "react-router-dom";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";



const categories = [
  { name: "Bags", image: assets.kick },
  { name: "Dresses/skirts", image: assets.banner },
  { name: "Accessories", image: assets.Accessories },
  { name: "Combo", image: assets.combo }, // kept your original spelling
];

console.log("blood")

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="categories">
      <h2 className="categories-title">Shop Our Top Categories.</h2>
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
              <div className="shopnow">
              <FaCircleArrowRight />
              <button className="btn-category">Shop Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      < div onClick={()=>navigate("/categories")} className="blood">
      <button className="slide">SHOP OUR CATEGORIES.</button>
      <FaArrowRight />

      </div>
    </section>
  );
};

export default Categories;

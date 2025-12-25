import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../Components/Card/Card.jsx";
import Spinner from "../../Components/Spinner/Spinner.jsx";
import "./Shopcat.css";

const BASE_URL = "https://thegoldfina.onrender.com";

const CategoryDisplay = () => {
  const { cat } = useParams();
  const decodedCategory = decodeURIComponent(cat || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategoryItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/products/category/${encodeURIComponent(decodedCategory)}`
      );
      console.log(res)
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching category products:", err.response?.data || err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (decodedCategory) fetchCategoryItems();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [decodedCategory]);

  return (
    <section className="category-display">
      <h2 className="category-title">{decodedCategory}<span> Category.</span></h2>

      <div className="category-grid">
        {loading ? (
          <Spinner />
        ) : products.length > 0 ? (
          products.map((product) => (
            <Card
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              desc={product.desc}
              category={product.category}
              image={product.images?.[0]}
            />
          ))
        ) : (
          <p>No products in {decodedCategory}</p>

        )}
      </div>
    </section>
  );
};

export default CategoryDisplay;

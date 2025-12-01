import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../Components/Spinner/Spinner.jsx";
import Card from "../../Components/Card/Card.jsx";
import { useNavigate } from "react-router-dom";
import "./Collection.css";

const MiniCollection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://thegoldfina.onrender.com";

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/products/fetch`);
      if (res.data.products) setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Only show first 5 items
  const limitedProducts = products.slice(0, 5);

  return (
    <section className="collection">
      <h2 className="collection-title">Trending Picks</h2>

      <div className="collection-grid">
        {loading ? (
          <Spinner />
        ) : limitedProducts.length > 0 ? (
          limitedProducts.map((product) => (
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
          <p>No products found.</p>
        )}
      </div>

      {/* SEE FULL COLLECTION BUTTON */}
      <div className="see-more-wrapper">
        <button
          className="see-more-btn"
          onClick={() => navigate("/collection")}
        >
          See Full Collection →
        </button>
      </div>
    </section>
  );
};

export default MiniCollection;

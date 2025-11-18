import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./BuyNow.css";

const BASE_URL = "https://thegoldfina.onrender.com";

const BuyNowCheckout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");
  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/products/fetch/${productId}`,
        { productId },
        getAuthHeader()
      );
    

      if (res.data.success) {
        setProduct(res.data.theproduct);
      } else {
        console.error("Buy Now error:", res.data.message);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Buy Now product:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleProceed = () => {
    navigate("/checkout"); // your final checkout payment route
  };

  return (
    <section className="buynow-checkout-page">
      <h2>Checkout (Buy Now)</h2>

      {loading ? (
        <p>Loading product...</p>
      ) : !product ? (
        <p>No product found.</p>
      ) : (
        <>
          <div className="buynow-grid">
            <div className="buynow-item">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="buynow-item-img"
              />

              <div className="buynow-item-info">
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>Price: KES {product.price}</p>
                <p>Quantity: 1</p>
                <p>Subtotal: KES {product.price}</p>
              </div>
            </div>
          </div>

          <div className="buynow-summary">
            <p>Total Items: 1</p>
            <p>Total Price: KES {product.price}</p>

            <div className="buynow-actions">
              <button className="btn-back" onClick={() => navigate(-1)}>
                Back
              </button>
              <button className="btn-checkout" onClick={handleProceed}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default BuyNowCheckout;

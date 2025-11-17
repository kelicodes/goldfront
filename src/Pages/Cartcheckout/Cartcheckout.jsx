import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CartCheckout.css";
import { logEvent } from "../../../analytics";

const BASE_URL = "https://thegoldfina.onrender.com";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");
  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      console.warn("No token found, cart will remain empty");
      setCart([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/cart/getcart`, getAuthHeader());
      console.log("Raw cart data:", res.data);

      if (!res.data.items || res.data.items.length === 0) {
        setCart([]);
        return;
      }

      const items = res.data.items
        .filter(i => i.productId)
        .map((i) => ({
          id: i._id,
          productId: i.productId._id,
          name: i.productId.name || "N/A",
          price: i.productId.price || 0,
          category: i.productId.category || "N/A",
          images: Array.isArray(i.productId.images) ? i.productId.images : [],
          quantity: i.quantity || 1,
        }));

      console.log("Mapped cart items:", items);
      setCart(items);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
      setCart([]);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, []);

  window.scrollTo({
  top: 0,
  behavior: "smooth"
});


  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const clearCart = () => {
  setCart([]); // clear the cart
  logEvent("Cart", "Cleared", "User cleared the cart"); // GA event
};

const proceedNext = () => {
  navigate("/checkout"); // change route
  logEvent("Checkout", "Proceed", "User proceeded to checkout"); // GA event
};

  return (
    <section className="checkout-page">
      <h2>Checkout</h2>

      {loading ? (
        <p>Loading cart...</p>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {cart.map((item, index) => (
              <div className="cart-item" key={`${item.productId}-${index}`}>
                {item.images[0] && (
                  <img src={item.images[0]} alt={item.name} className="cart-item-img" />
                )}
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Category: {item.category}</p>
                  <p>Price: KES {item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Subtotal: KES {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p>Total Items: {getTotalItems()}</p>
            <p>Total Price: KES {getTotalPrice()}</p>

            {/* ===== New Buttons ===== */}
            <div className="cart-actions">
              <button className="btn-clear" onClick={clearCart}>Clear Cart</button>
              <button className="btn-checkout" onClick={proceedNext}>Checkout.</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CheckoutPage;

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
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      setCart([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/cart/getcart`, getAuthHeader());

      if (!res.data.items || res.data.items.length === 0) {
        setCart([]);
        return;
      }

      const items = res.data.items
        .filter((i) => i.productId)
        .map((i) => ({
          id: i._id,
          productId: i.productId._id,
          name: i.productId.name || "N/A",
          price: i.productId.price || 0,
          category: i.productId.category || "N/A",
          images: Array.isArray(i.productId.images) ? i.productId.images : [],
          quantity: i.quantity || 1,
        }));

      setCart(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadCart = async () => {
      setLoading(true);
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, []);

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const clearCart = async () => {
  const token = getToken();
  if (!token) return;

  try {
    setLoading(true); // Optional: show loading while clearing
    await axios.post(`${BASE_URL}/cart/clear`, {}, getAuthHeader());
    logEvent("Cart", "Cleared", "User cleared the cart");

    // Update frontend state
    setCart([]);
  } catch (error) {
    console.error("Error clearing cart:", error);
    alert("Failed to clear cart. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const proceedNext = () => {
    navigate("/checkout");
    logEvent("Checkout", "Proceed", "User proceeded to checkout");
  };

  return (
    <section className="cart-checkout">
      <h2 className="cart-title">Your Cart</h2>

      {loading ? (
        <p className="loading-text">Loading your cart...</p>
      ) : cart.length === 0 ? (
        <div className="empty-cart-box">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="empty-cart-img"
          />

          <h3>Your cart is empty 🛒</h3>
          <p>Looks like you haven’t added anything yet. Explore our products and find something you love!</p>

          <button className="shop-now-btn" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-grid">
            {cart.map((item, i) => (
              <div className="cart-item" key={`${item.productId}-${i}`}>
                {item.images[0] && (
                  <img src={item.images[0]} alt={item.name} className="cart-item-img" />
                )}

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Category: {item.category}</p>
                  <p>Price: KES {item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p className="subtotal">Subtotal: KES {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p>Total Items: {getTotalItems()}</p>
            <p>Total Price: KES {getTotalPrice()}</p>

            <div className="cart-actions">
              <button className="btn-clear" onClick={clearCart}>
                Clear Cart
              </button>
              <button className="btn-checkout" onClick={proceedNext}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CheckoutPage;

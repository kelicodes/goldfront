import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext();

const BASE_URL = "https://goldback2.onrender.com";

export const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // ===== AUTH HELPERS =====
  const getToken = () => localStorage.getItem("token");
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  // ===== FETCH PRODUCTS =====
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products/fetch`);
      if (res.data.products) setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err.message);
    }
  };

  // ===== FETCH SINGLE PRODUCT =====
  const fetchProductById = async (productId) => {
    try {
      const res = await axios.get(`${BASE_URL}/products/fetch/${productId}`);
      return res.data.success ? res.data.theproduct : null;
    } catch (err) {
      console.error("Fetch product details error:", err.response?.data || err.message);
      return null;
    }
  };

  // ===== CART =====
  const myCart = async () => {
    const token = getToken();
    if (!token) {
      console.warn("No token found, cart will remain empty");
      setCart([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/cart/getcart`, getAuthHeader());
      if (!res.data.cart?.items) return setCart([]);

      const items = await Promise.all(
        res.data.cart.items.map(async (i) => {
          const product = await fetchProductById(i.productId);
          return {
            productId: i.productId,
            name: product?.name || "N/A",
            price: product?.price || 0,
            category: product?.category || "N/A",
            images: product?.images || [],
            quantity: i.quantity,
          };
        })
      );

      setCart(items);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
      setCart([]);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const token = getToken();
    if (!token) {
      alert("You must login first!");
      return false;
    }

    try {
      await axios.post(`${BASE_URL}/cart/add`, { productId, quantity }, getAuthHeader());
      await myCart(); // Refresh cart
      return true;
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Add to cart failed");
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.post(`${BASE_URL}/cart/remove`, { productId }, getAuthHeader());
      await myCart(); // Refresh cart
    } catch (err) {
      console.error("Remove from cart error:", err.response?.data || err.message);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    try {
      await axios.post(`${BASE_URL}/cart/update`, { productId, quantity }, getAuthHeader());
      await myCart(); // Refresh cart
    } catch (err) {
      console.error("Update cart quantity error:", err.response?.data || err.message);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post(`${BASE_URL}/cart/clear`, {}, getAuthHeader());
      setCart([]);
    } catch (err) {
      console.error("Clear cart error:", err.response?.data || err.message);
    }
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ===== ORDERS =====
  const fetchOrders = async () => {
    const token = getToken();
    if (!token) return; // Only fetch if logged in
    try {
      const res = await axios.get(`${BASE_URL}/orders/userorders`, getAuthHeader());
      
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err.response?.data || err.message);
    }
  };

  const fetchUserOrders = async () => {
    const token = getToken();
    if (!token) return [];
    try {
      const res = await axios.get(`${BASE_URL}/orders`, getAuthHeader());
      if (res.data.success) {
        setOrders(res.data.orders);
        return res.data.orders;
      }
      return [];
    } catch (err) {
      console.error("Fetch user orders error:", err.response?.data || err.message);
      return [];
    }
  };

  const createOrder = async (paymentMethod, shippingAddress) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/orders/create`,
        { paymentMethod, shippingAddress },
        getAuthHeader()
      );
      if (res.data.order) {
        setOrders((prev) => [res.data.order, ...prev]);
        setCart([]);
      }
      return res.data;
    } catch (err) {
      console.error("Create order error:", err.response?.data || err.message);
      return { success: false };
    }
  };

  const payWithMpesa = async (orderId, phone) => {
    try {
      const res = await axios.post(`${BASE_URL}/pesa/callback`, { orderId, phone }, getAuthHeader());
      return res.data;
    } catch (err) {
      console.error("STK push error:", err.response?.data || err.message);
      return { success: false };
    }
  };

  // ===== INITIAL LOAD =====
  useEffect(() => {
    const init = async () => {
      await fetchProducts();
      if (getToken()) await myCart(); // Only load cart if logged in
      if (getToken()) await fetchOrders();
    };
    init();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        fetchProducts,
        fetchOrders,
        createOrder,
        payWithMpesa,
        fetchProductById,
        fetchUserOrders,
        myCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

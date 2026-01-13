// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect,useState } from "react";

import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import ProtectedRoute from "./Components/Protected/ProtectedRoute.jsx";

import { initGA, logPageView } from "./analytics.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";

import ProductDetail from "./Pages/Productdetail/Productdetail.jsx";
import CartCheckout from "./Pages/Cartcheckout/Cartcheckout.jsx";
import CheckoutPage from "./Pages/Checkout/Checkout.jsx";
import Orders from "./Pages/Orders/Orders.jsx";
import CategoryDisplay from "./Pages/Shopcat/Shopcat.jsx";
import BuyNowCheckout from "./Pages/Buynow/BuyNow.jsx";
import Collection from "./Pages/Collection/Collection.jsx";
import Categories from "./Components/Categories/Categories.jsx";
import Closet from "./Pages/Closet/Closet.jsx";
import Acc from "./Pages/Acc/Acc.jsx";
import ForgotPassword from "./Components/Password/Password.jsx";

const App = () => {
  const location = useLocation();
  const [hallaG,setHallag]=useState(true)

  // Routes where layout (Navbar/Footer) should be hidden
  const hideLayout = ["/login","/forgot-password"];
  const showLayout = !hideLayout.includes(location.pathname);

  // Initialize GA once on first render
  useEffect(() => {
    initGA();
  }, []);

  // Log page views on route change
  useEffect(() => {
    logPageView(location.pathname);
  }, [location.pathname]);


  if(!hallaG){
    return <>
    <p>GOLDSTORE</p></>
  }

  return (
    <div className="app">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Conditional Layout */}
      {showLayout && <Navbar />}

      <main className="maincont" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartCheckout />
              </ProtectedRoute>
            }
          />
          <Route 
          path="/closet"
          element={
            <ProtectedRoute>
              <Closet/>
            </ProtectedRoute>
          }
          />
          <Route 
          path="/profile"
          element={
            <ProtectedRoute>
              <Acc/>
            </ProtectedRoute>
          }
          />
          <Route
            path="/checkout/:orderId"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          
          <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories/>
            </ProtectedRoute>
          }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
          path="/forgot-password"
          element={
            <ForgotPassword/>
          }
          />
          <Route
            path="/buynow/:productId"
            element={
              <ProtectedRoute>
                <BuyNowCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:cat"
            element={
              <ProtectedRoute>
                <CategoryDisplay />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {showLayout && <Footer />}
    </div>
  );
};

export default App;

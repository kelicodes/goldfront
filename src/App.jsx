import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import { initGA, logPageView } from "./analytics.js";

import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import Collection from "./Components/Collection/Collection.jsx";
import ProductDetail from "./Pages/Productdetail/Productdetail.jsx";
import Cartcheckout from "./Pages/Cartcheckout/Cartcheckout.jsx";
import CheckoutPage from "./Pages/Checkout/Checkout.jsx";
import Orders from "./Pages/Orders/Orders.jsx";
import ProtectedRoute from "./Components/Protected/ProtectedRoute.jsx";
import BuyNowCheckout from "./Pages/Buynow/BuyNow.jsx";
import { useEffect } from "react";

const App = () => {
  const location = useLocation();

  // Pages where we don't want Navbar and Footer
  const hideLayout = ["/login"];
  const showLayout = !hideLayout.includes(location.pathname);

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);

  return (
    <div className="app">
      {showLayout && <Navbar />}
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Protected routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cartcheckout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
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

          {/* BUY NOW WITH PARAMS */}
          <Route
            path="/buynow/:productId"
            element={
              <ProtectedRoute>
                <BuyNowCheckout />
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

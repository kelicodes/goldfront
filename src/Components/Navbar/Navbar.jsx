import { useState, useEffect, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, ShoppingCart, LogOut } from "lucide-react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { AuthContext } from "../../Context/Authcontext.jsx";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  // Use optional chaining and defaults
  const shopCtx = useContext(ShopContext) || {};
  const cart = shopCtx.cart || [];
  const myCart = shopCtx.myCart || (() => {});

  const authCtx = useContext(AuthContext) || {};
  const setToken = authCtx.setToken || (() => {});

  // Fetch cart when navbar mounts
  useEffect(() => {
    myCart(); // fetch user's cart data
  }, []);

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/" },
    { name: "About", path: "/" },
    { name: "Contact", path: "/" }
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <h2>
          Gold<span>Store</span>
        </h2>
      </div>

      {/* Links */}
      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.path}
              className={window.location.pathname === link.path ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      {/* Right Side */}
      <div className="navbar-right">
        {/* Cart Icon */}
        <div className="navbar-cart" onClick={() => navigate("/cart")}>
          <ShoppingCart size={24} />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </div>

        {/* Theme Toggle */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </div>

        {/* Logout Button */}
        <div className="logout-btn" onClick={handleLogout}>
          <LogOut size={24} />
        </div>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

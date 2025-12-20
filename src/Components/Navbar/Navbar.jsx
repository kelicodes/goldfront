import { useState, useEffect, useContext, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { AuthContext } from "../../Context/Authcontext.jsx";

import "./Navbar.css";

const Navbar = () => {
  const [theme, setTheme] = useState("light");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const shopCtx = useContext(ShopContext) || {};
  const cart = shopCtx.cart || [];
  const myCart = shopCtx.myCart || (() => {});

  const authCtx = useContext(AuthContext) || {};
  const setToken = authCtx.setToken || (() => {});

  useEffect(() => { myCart(); }, []);
  useEffect(() => { document.documentElement.setAttribute("theme", theme); }, [theme]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
    setDropdownOpen(false);
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
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <h2>Gold<span>Store</span></h2>
      </div>

      {/* Hamburger for mobile */}
      <div className="navbar-hamburger" onClick={() => setMenuOpen(prev => !prev)}>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
      </div>

      {/* Links */}
      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.path}
              className={window.location.pathname === link.path ? "active" : ""}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      {/* Right Side */}
      <div className="navbar-right">
        {/* Cart */}
        <div className="navbar-cart" onClick={() => navigate("/cart")}>
          <span>🛒</span>
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </div>

        {/* User Dropdown */}
        <div className="navbar-user" ref={dropdownRef}>
          <CgProfile
            size={28}
            onClick={() => setDropdownOpen(prev => !prev)}
            style={{ cursor: "pointer" }}
          />
          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-item" onClick={() => { navigate("/orders"); setDropdownOpen(false); }}>
                Orders
              </div>
              <div className="dropdown-item" onClick={() => { navigate("/closet"); setDropdownOpen(false); }}>
                Closet
              </div>
              <div className="dropdown-item" onClick={() => { navigate("/profile"); setDropdownOpen(false); }}>
                My Profile
              </div>
              <div className="dropdown-item logout" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

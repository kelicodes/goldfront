import React, { useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./Card.css";

const Card = ({ id, name, price, desc, category, image }) => {
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    addToCart({ _id: id, name, price, category, images: [image], quantity: 1 });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation(); // Prevent card click
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    navigate(`/buynow/${id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <img src={image} alt={name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{name}</h3>
        <p className="card-desc">{desc}</p>
  
        <div className="card-footer">
          <span className="card-price">KES {price}</span>
          <div className="card-buttons">
            <button className="btn-add-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

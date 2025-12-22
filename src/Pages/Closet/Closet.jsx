import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./Closet.css";

const BASE_URL = "https://thegoldfina.onrender.com";

const Closet = () => {
  const { cart, products } = useContext(ShopContext);
  const token = localStorage.getItem("token");

  const [avatar, setAvatar] = useState(null);
  const [selectedClothing, setSelectedClothing] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH AVATAR ================= */
  useEffect(() => {
    if (!token) return;

    const fetchAvatar = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/avatar`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAvatar(res.data?.avatar || null);
      } catch (err) {
        console.error("Avatar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [token]);

  /* ================= SOURCE ITEMS ================= */
  const sourceItems = useMemo(() => {
    if (cart?.length > 0) return cart;
    return products || [];
  }, [cart, products]);

  /* ================= SELECT CLOTHING ================= */
  const handleSelect = (img) => {
    setSelectedClothing(img);
  };

  /* ================= AUTH STATES ================= */
  if (!token) {
    return (
      <div className="closet-container center">
        <h2>Virtual Closet</h2>
        <p>Login to access your closet.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="closet-container center">
        <p>Loading closet...</p>
      </div>
    );
  }

  if (!avatar) {
    return (
      <div className="closet-container center">
        <h2>No Avatar Found</h2>
        <a href="/profile-setup">
          <button className="primary-btn">Create Profile</button>
        </a>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="closet-container">
      <h2>My Closet</h2>

      {/* AVATAR */}
      <div className="avatar-wrapper">
        <div className="avatar-frame">
          <img
            src={avatar.imageUrl || avatar.originalImage}
            alt="Avatar"
            className="avatar-main"
          />

          {selectedClothing && (
            <img
              src={
                selectedClothing.startsWith("http")
                  ? selectedClothing
                  : `${BASE_URL}${selectedClothing}`
              }
              alt="Clothing"
              className="clothing-overlay"
            />
          )}
        </div>
      </div>

      {/* CLOTHING LIST */}
      <div className="category-items">
        {sourceItems.length === 0 && (
          <p className="empty-text">No items available</p>
        )}

        {sourceItems.map((item) =>
          item.images?.map((img, idx) => (
            <img
              key={`${item._id}-${idx}`}
              src={img.startsWith("http") ? img : `${BASE_URL}${img}`}
              alt={item.name}
              className="closet-img"
              onClick={() => handleSelect(img)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Closet;

import { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./Closet.css";

const categories = ["Bags", "T-shirts", "Skirts/Dresses", "Trousers", "Combo"];

const Closet = ({ avatar, onSelectClothing }) => {
  const { cart } = useContext(ShopContext);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter cart items by category
  const itemsByCategory = {};
  categories.forEach((cat) => {
    itemsByCategory[cat] = cart.filter((item) => item.category === cat);
  });

  // Handle image selection
  const handleSelect = (item, img) => {
    if (item.category.toLowerCase() === "combo") {
      onSelectClothing({ combo: img });
      return;
    }

    onSelectClothing((prev) => ({
      ...prev,
      [item.category.toLowerCase()]: img,
    }));
  };

  return (
    <div className="closet-container">
      <h2>My Closet</h2>

      <div className="avatar-wrapper">
        {avatar && (
          <div className="avatar-frame">
            <img src={avatar} alt="Avatar" className="avatar-main" />
            {Object.values(onSelectClothing).map(
              (clothing, idx) =>
                clothing && (
                  <img
                    key={idx}
                    src={clothing}
                    alt="Clothing"
                    className="clothing-overlay"
                  />
                )
            )}
          </div>
        )}
      </div>

      <div className="categories">
        {categories.map((cat) => (
          <div key={cat} className="category-section">
            {itemsByCategory[cat]?.length > 0 && (
              <>
                <h3>{cat}</h3>
                <div className="category-items">
                  {itemsByCategory[cat].map((item) =>
                    item.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={item.name}
                        className="closet-img"
                        onClick={() => handleSelect(item, img)}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Closet;

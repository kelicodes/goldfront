import { useContext, useState, useMemo } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./Closet.css";

const categories = ["Bags", "T-shirts", "Skirts/Dresses", "Trousers", "Combo"];

const Closet = ({ avatar, selectedClothing, onSelectClothing }) => {
  const { cart } = useContext(ShopContext);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Group cart items by category
  const itemsByCategory = useMemo(() => {
    const grouped = {};
    categories.forEach((cat) => {
      grouped[cat] = cart.filter((item) => item.category === cat);
    });
    return grouped;
  }, [cart]);

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
            {selectedClothing &&
              Object.entries(selectedClothing).map(
                ([category, clothingImg]) =>
                  clothingImg && (
                    <img
                      key={category}
                      src={clothingImg}
                      alt={category}
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
                <h3
                  className={`category-title ${
                    selectedCategory === cat ? "selected" : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat ? null : cat
                    )
                  }
                >
                  {cat}
                </h3>
                {selectedCategory === cat && (
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
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Closet;

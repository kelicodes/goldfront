import React, { useState, useEffect } from "react";
import axios from "axios"; // make sure axios is imported
import Spinner from "../../Components/Spinner/Spinner.jsx";
import Card from "../../Components/Card/Card.jsx";
import "./Collection.css";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const BASE_URL = "https://goldback2.onrender.com";
  const categories = ["All", "Shoes", "Sweatpants", "Jackets", "Hoodies"];

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/products/fetch`);
      console.log
      if (res.data.products) setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter, search, and sort products
  useEffect(() => {
    let tempProducts = Array.isArray(products) ? [...products] : [];

    // Category filter
    if (categoryFilter !== "All") {
      tempProducts = tempProducts.filter(
        (prod) => prod.category === categoryFilter
      );
    }

    // Search filter
    if (searchTerm.trim() !== "") {
      tempProducts = tempProducts.filter(
        (prod) =>
          prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prod.desc?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortOption === "price-high") {
      tempProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "price-low") {
      tempProducts.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(tempProducts);
  }, [products, categoryFilter, sortOption, searchTerm]);

  return (
    <section className="collection">
      <h2 className="collection-title">Our Collection</h2>

      {/* Toggle filters drawer */}
      <button
        className="drawer-toggle"
        onClick={() => setShowFilters((prev) => !prev)}
      >
        {showFilters ? "Close Filters" : "Open Filters"}
      </button>

      {/* Filters drawer */}
      <div className={`filters-drawer ${showFilters ? "open" : ""}`}>
        <h3>Filters</h3>

        <div className="filter-group">
          <label>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="apply-btn"
          onClick={() => setShowFilters(false)}
        >
          Apply Filters
        </button>
      </div>

      {/* Product grid */}
      <div className="collection-grid">
        {loading ? (
          <Spinner />
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              desc={product.desc}
              category={product.category}
              image={product.images?.[0]}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </section>
  );
};

export default Collection;

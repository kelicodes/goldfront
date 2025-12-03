import React, { useState, useEffect } from "react";4
import {assets} from "../../assets/asssets.js"
import "./Banner.css";

const Banner = () => {
  const banners = [
    {
      image: assets.banner,
      title: "Discover the Latest Fashion",
      subtitle: "Trendy styles picked just for you",
      cta1: "Shop Now",
      cta2: "Learn More",
    },
    {
      image: assets.kick,
      title: "Exclusive Deals in Store",
      subtitle: "Get up to 50% off on selected items",
      cta1: "Grab Offer",
      cta2: "Explore",
    },
    {
      image: assets.bag,
      title: "New Arrivals This Season",
      subtitle: "Fresh designs you’ll fall in love with",
      cta1: "View Collection",
      cta2: "See More",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Automatically switch banner every 3 minutes (180,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const banner = banners[current];

  return (
    <div className="banner" style={{ backgroundImage: `url(${banner.image})` }}>
      <div className="banner-content">
        <h1 className="banner-title">{banner.title}</h1>
        <p className="banner-subtitle">{banner.subtitle}</p>
        <div className="banner-buttons">
          <button className="btn-primary">{banner.cta1}</button>
          <button className="btn-secondary">{banner.cta2}</button>
        </div>
      </div>
    </div>
  );
};

export default Banner;

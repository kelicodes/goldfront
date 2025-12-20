import "./Acc.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Acc = () => {
  const [profileData, setProfileData] = useState(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [clothingSize, setClothingSize] = useState("");
  const [shoeSize, setShoeSize] = useState("");
  const [favoriteColor, setFavoriteColor] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  // Fetch profile if token exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          "https://thegoldfina.onrender.com/avatar/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.avatar) {
          setProfileData(res.data.avatar);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !height || !weight || !clothingSize || !shoeSize ||
      !favoriteColor || !stylePreference || !budgetRange || !bodyType || !image
    ) {
      toast.error("Please fill all fields and upload an image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("height", height);
      formData.append("weight", weight);
      formData.append("clothingSize", clothingSize);
      formData.append("shoeSize", shoeSize);
      formData.append("favoriteColor", favoriteColor);
      formData.append("stylePreference", stylePreference);
      formData.append("budgetRange", budgetRange);
      formData.append("bodyType", bodyType);
      formData.append("avatar", image);

      await axios.post(
        "https://thegoldfina.onrender.com/avatar/upload",
        formData,
        config
      );

      toast.info(
        "Profile saved! Your animated avatar is being created. This may take up to 5 minutes."
      );

      setTimeout(() => {
        window.location.href = "/collections";
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  // Guest view
  if (!token) {
    return (
      <div className="acc-container">
        <h2>Welcome to Your Virtual Closet</h2>
        <p>Share your details and create your avatar to start exploring personalized collections.</p>
        <a href="/login">
          <button className="login-btn">Login to Create Profile</button>
        </a>
      </div>
    );
  }

  // Logged-in user with profile
  if (profileData) {
    return (
      <div className="acc-container">
        <h2>My Profile</h2>
        <div className="profile-details">
          <p><strong>Height:</strong> {profileData.height} cm</p>
          <p><strong>Weight:</strong> {profileData.weight} kg</p>
          <p><strong>Clothing Size:</strong> {profileData.clothingSize}</p>
          <p><strong>Shoe Size:</strong> {profileData.shoeSize}</p>
          <p><strong>Favorite Color:</strong> {profileData.favoriteColor}</p>
          <p><strong>Style Preference:</strong> {profileData.stylePreference}</p>
          <p><strong>Budget Range:</strong> {profileData.budgetRange} KES</p>
          <p><strong>Body Type:</strong> {profileData.bodyType}</p>
          {profileData.avatar && (
            <img src={profileData.avatar} alt="Avatar" className="avatar-preview" />
          )}
        </div>
      </div>
    );
  }

  // Logged-in user without profile (create profile)
  return (
    <div className="acc-container">
      <h2>Create Your Profile</h2>
      <form className="acc-form" onSubmit={handleSubmit}>
        <label>Height (cm):</label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Enter height" />

        <label>Weight (kg):</label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter weight" />

        <label>Clothing Size:</label>
        <select value={clothingSize} onChange={(e) => setClothingSize(e.target.value)}>
          <option value="">Select Size</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>

        <label>Shoe Size:</label>
        <select value={shoeSize} onChange={(e) => setShoeSize(e.target.value)}>
          <option value="">Select Shoe Size</option>
          {[...Array(15).keys()].map((i) => (
            <option key={i} value={i + 35}>{i + 35}</option>
          ))}
        </select>

        <label>Favorite Color:</label>
        <select value={favoriteColor} onChange={(e) => setFavoriteColor(e.target.value)}>
          <option value="">Select Color</option>
          <option value="Red">Red</option>
          <option value="Blue">Blue</option>
          <option value="Green">Green</option>
          <option value="Yellow">Yellow</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
        </select>

        <label>Style Preference:</label>
        <select value={stylePreference} onChange={(e) => setStylePreference(e.target.value)}>
          <option value="">Select Style</option>
          <option value="Casual">Casual</option>
          <option value="Streetwear">Streetwear</option>
          <option value="Formal">Formal</option>
          <option value="Sporty">Sporty</option>
          <option value="Elegant">Elegant</option>
        </select>

        <label>Budget Range:</label>
        <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
          <option value="">Select Budget</option>
          <option value="5000-10000">5,000 - 10,000 KES</option>
          <option value="10000-20000">10,000 - 20,000 KES</option>
          <option value="20000-50000">20,000 - 50,000 KES</option>
          <option value="50000+">50,000+ KES</option>
        </select>

        <label>Body Type / Fit Preference:</label>
        <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
          <option value="">Select Body Type</option>
          <option value="Slim">Slim</option>
          <option value="Regular">Regular</option>
          <option value="Loose">Loose</option>
          <option value="Athletic">Athletic</option>
        </select>

        <label>Full Body Image:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default Acc;

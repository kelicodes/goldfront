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

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  // Fetch profile
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://thegoldfina.onrender.com/avatar/",
          { headers: { Authorization: `Bearer ${token}`,   "Content-Type": "multipart/form-data",
 } }
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

  if (!image) {
    toast.error("Upload an image");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  formData.append("height", height);
  formData.append("weight", weight);
  formData.append("clothingSize", clothingSize);
  formData.append("shoeSize", Number(shoeSize));
  formData.append("favoriteColor", favoriteColor);
  formData.append("stylePreference", stylePreference);
  formData.append("budgetRange", budgetRange);
  formData.append("bodyType", bodyType);
  formData.append("file", image);

  try {
    const res = await axios.post(
      "https://thegoldfina.onrender.com/avatar/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Profile created 🎉");
    setTimeout(() => {
      window.location.href = "/collection";
    }, 800);

  } catch (err) {
    console.error(err);
    toast.error("Upload failed");
  } finally {
    setLoading(false);
  }
};
;

  // Guest view
  if (!token) {
    return (
      <div className="acc-container">
        <h2>Welcome to Your Virtual Closet</h2>
        <p>
          Share your details to create your avatar and explore personalized collections.
        </p>
        <a href="/login">
          <button className="login-btn">Login to Create Profile</button>
        </a>
      </div>
    );
  }

  // Profile exists
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
            <img
                src={profileData.imageUrl || profileData.originalImage}
              alt="Avatar"
              className="avatar-preview"
            />
          )}
        </div>
      </div>
    );
  }

  // Create profile
  return (
    <div className="acc-container">
      <h2>Create Your Profile</h2>

      <form
        className="acc-form"
        onSubmit={handleSubmit}
        style={{ opacity: loading ? 0.6 : 1 }}
      >
        <label>Height (cm)</label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />

        <label>Weight (kg)</label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />

        <label>Clothing Size</label>
        <select value={clothingSize} onChange={(e) => setClothingSize(e.target.value)}>
          <option value="">Select</option>
          <option>XS</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
          <option>XXL</option>
        </select>

        <label>Shoe Size</label>
        <select value={shoeSize} onChange={(e) => setShoeSize(e.target.value)}>
          <option value="">Select</option>
          {[...Array(15).keys()].map((i) => (
            <option key={i} value={i + 35}>{i + 35}</option>
          ))}
        </select>

        <label>Favorite Color</label>
        <select value={favoriteColor} onChange={(e) => setFavoriteColor(e.target.value)}>
          <option value="">Select</option>
          <option>Red</option>
          <option>Blue</option>
          <option>Green</option>
          <option>Black</option>
          <option>White</option>
          <option>Gold</option>
        </select>

        <label>Style Preference</label>
        <select value={stylePreference} onChange={(e) => setStylePreference(e.target.value)}>
          <option value="">Select</option>
          <option>Casual</option>
          <option>Streetwear</option>
          <option>Formal</option>
          <option>Sporty</option>
        </select>

        <label>Budget Range</label>
        <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
          <option value="">Select</option>
          <option value="5000-10000">5k - 10k</option>
          <option value="10000-20000">10k - 20k</option>
          <option value="20000-50000">20k - 50k</option>
          <option value="50000+">50k+</option>
        </select>

        <label>Body Type</label>
        <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
          <option value="">Select</option>
          <option>Slim</option>
          <option>Regular</option>
          <option>Athletic</option>
          <option>Loose</option>
        </select>

        <label>Full Body Image</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit" disabled={loading}>
          {loading ? "Creating your account..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default Acc;

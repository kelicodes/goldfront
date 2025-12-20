import "./Acc.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Acc = ({ token }) => {
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
  const [editing, setEditing] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://thegoldfina.onrender.com/avatar/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.avatar) {
          const data = res.data.avatar;
          setProfileData(data);
          setHeight(data.height || "");
          setWeight(data.weight || "");
          setClothingSize(data.clothingSize || "");
          setShoeSize(data.shoeSize || "");
          setFavoriteColor(data.favoriteColor || "");
          setStylePreference(data.stylePreference || "");
          setBudgetRange(data.budgetRange || "");
          setBodyType(data.bodyType || "");
        }
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !height ||
      !weight ||
      !clothingSize ||
      !shoeSize ||
      !favoriteColor ||
      !stylePreference ||
      !budgetRange ||
      !bodyType ||
      (!image && !profileData?.avatar)
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
      if (image) formData.append("avatar", image);

      const res = await axios.post(
        "https://thegoldfina.onrender.com/avatar/upload",
        formData,
        config
      );

      if (res.data.avatar) {
        toast.success("Profile saved successfully!");
        setProfileData(res.data.avatar);
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="acc-container">
      <h2>My Profile</h2>

      {!profileData || editing ? (
        <form className="acc-form" onSubmit={handleSubmit}>
          <label>Height (cm):</label>
          <input
            type="number"
            value={height}
            placeholder="Enter height"
            onChange={(e) => setHeight(e.target.value)}
          />

          <label>Weight (kg):</label>
          <input
            type="number"
            value={weight}
            placeholder="Enter weight"
            onChange={(e) => setWeight(e.target.value)}
          />

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
            <option value="$50-$100">$50-$100</option>
            <option value="$100-$200">$100-$200</option>
            <option value="$200-$500">$200-$500</option>
            <option value="$500+">$500+</option>
          </select>

          <label>Body Type / Fit Preference:</label>
          <select value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
            <option value="">Select Body Type</option>
            <option value="Slim">Slim</option>
            <option value="Regular">Regular</option>
            <option value="Loose">Loose</option>
            <option value="Athletic">Athletic</option>
          </select>

          <label>Full Body Image (optional):</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          {profileData?.avatar && !image && (
            <img src={profileData.avatar} alt="Current avatar" className="avatar-preview" />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : profileData ? "Update Profile" : "Save Profile"}
          </button>
        </form>
      ) : (
        <div className="acc-info">
          <p><strong>Height:</strong> {profileData.height} cm</p>
          <p><strong>Weight:</strong> {profileData.weight} kg</p>
          <p><strong>Clothing Size:</strong> {profileData.clothingSize}</p>
          <p><strong>Shoe Size:</strong> {profileData.shoeSize}</p>
          <p><strong>Favorite Color:</strong> {profileData.favoriteColor}</p>
          <p><strong>Style Preference:</strong> {profileData.stylePreference}</p>
          <p><strong>Budget Range:</strong> {profileData.budgetRange}</p>
          <p><strong>Body Type:</strong> {profileData.bodyType}</p>
          {profileData.avatar && (
            <img src={profileData.avatar} alt="Avatar" className="avatar-preview" />
          )}
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Acc;

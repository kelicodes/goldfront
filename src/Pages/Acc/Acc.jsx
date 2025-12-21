import "./Acc.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const BASE_URL = "https://thegoldfina.onrender.com";

const Acc = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= HELPERS ================= */
  const calculateBMI = (heightCm, weightKg) => {
    if (!heightCm || !weightKg) return null;
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [userRes, avatarRes] = await Promise.all([
          axios.get(`${BASE_URL}/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/avatar`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (userRes.data?.user) setUser(userRes.data.user);
        if (avatarRes.data?.avatar) setAvatar(avatarRes.data.avatar);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  /* ================= GUEST ================= */
  if (!token) {
    return (
      <div className="acc-container center">
        <h2>Virtual Closet</h2>
        <p>Login to access your personalized wardrobe.</p>
        <a href="/login">
          <button className="primary-btn">Login</button>
        </a>
      </div>
    );
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="acc-container center">
        <p>Loading your profile...</p>
      </div>
    );
  }

  /* ================= NO AVATAR ================= */
  if (!avatar) {
    return (
      <div className="acc-container center">
        <h2>Create Your Style Profile</h2>
        <p>Complete your profile to unlock personalized fashion.</p>
        <a href="/profile-setup">
          <button className="primary-btn">Create Profile</button>
        </a>
      </div>
    );
  }

  /* ================= DERIVED DATA ================= */
  const bmi = calculateBMI(avatar.height, avatar.weight);
  const bmiCategory = getBMICategory(bmi);

  /* ================= CHART DATA ================= */
  const metricsData = [
    { name: "Height (cm)", value: avatar.height },
    { name: "Weight (kg)", value: avatar.weight },
    { name: "BMI", value: Number(bmi) },
  ];

  const styleData = [
    { attribute: "Casual", value: avatar.stylePreference === "Casual" ? 100 : 30 },
    { attribute: "Streetwear", value: avatar.stylePreference === "Streetwear" ? 100 : 30 },
    { attribute: "Formal", value: avatar.stylePreference === "Formal" ? 100 : 30 },
    { attribute: "Sporty", value: avatar.stylePreference === "Sporty" ? 100 : 30 },
  ];

  /* ================= PROFILE VIEW ================= */
  return (
    <div className="acc-container">
      {/* Greeting Header */}
      <div className="profile-header">
        <div className="avatar-wrapper">
          <img
            src={avatar.imageUrl || avatar.originalImage}
            alt="Avatar"
            className="avatar-img rounded-avatar"
          />
        </div>
        <div className="profile-meta">
          <h2>Hi {user?.name}, welcome to your profile</h2>
          <p className="muted">{user?.email}</p>
          <span className={`bmi-pill ${bmiCategory.toLowerCase()}`}>
            BMI: {bmi} ({bmiCategory})
          </span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="profile-grid">
        <div className="profile-card">
          <h4>Body Metrics</h4>
          <p>Height: {avatar.height} cm</p>
          <p>Weight: {avatar.weight} kg</p>
          <p>Body Type: {avatar.bodyType}</p>
        </div>

        <div className="profile-card">
          <h4>Sizes</h4>
          <p>Clothing: {avatar.clothingSize}</p>
          <p>Shoe: {avatar.shoeSize}</p>
        </div>

        <div className="profile-card">
          <h4>Style Preferences</h4>
          <p>Style: {avatar.stylePreference}</p>
          <p>Color: {avatar.favoriteColor}</p>
          <p>Budget: {avatar.budgetRange} KES</p>
        </div>

        <div className="profile-card highlight">
          <h4>Style Insights</h4>
          <ul>
            <li>Best fit for {avatar.bodyType} builds</li>
            <li>{avatar.stylePreference} outfits recommended</li>
            <li>{avatar.favoriteColor} tones suit you best</li>
            {bmiCategory === "Overweight" && <li>Relaxed & straight fits suggested</li>}
            {bmiCategory === "Normal" && <li>Most styles will fit perfectly</li>}
          </ul>
        </div>

        {/* Charts */}
        <div className="profile-card">
          <h4>Body Metrics Chart</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="var(--primary-color)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="profile-card highlight">
          <h4>Style Preference Radar</h4>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={styleData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="attribute" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                dataKey="value"
                stroke="var(--primary-color)"
                fill="var(--primary-color)"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Acc;

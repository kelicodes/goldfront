import { useState } from "react";
import axios from "axios";
import "./Password.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submitEmail = async () => {
    try {
      setLoading(true);
      console.log(email)
      const res = await axios.post("https://thegoldfina.onrender.com/user/forgot-password", { email });
      setMessage(res.data.message);
      if (res.data.success) setStep(2);
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post("https://thegoldfina.onrender.com/user/verify-reset-code", { email, code });
      if (res.data.success) {
        setResetToken(res.data.resetToken);
        setStep(3);
      } else {
        setMessage(res.data.message);
      }
    } catch {
      setMessage("Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://thegoldfina.onrender.com/user/reset-password",
        { newPassword },
        { headers: { Authorization: `Bearer ${resetToken}` } }
      );
      setMessage(res.data.message);
      if (res.data.success) setStep(4);
    } catch {
      setMessage("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-wrapper">
      <div className="fp-card">
        <h2>
          {step === 1 && "Forgot Password?"}
          {step === 2 && "Enter Verification Code"}
          {step === 3 && "Set New Password"}
          {step === 4 && "Success"}
        </h2>

        {message && <p className="fp-message">{message}</p>}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={submitEmail} disabled={loading}>
              {loading ? "Sending..." : "Send Code"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={submitCode} disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={submitPassword} disabled={loading}>
              {loading ? "Saving..." : "Change Password"}
            </button>
          </>
        )}

        {step === 4 && (
          <p className="success-text">
            Password changed successfully. You can now log in.
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

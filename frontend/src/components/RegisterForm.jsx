import React, { useState } from "react";
import axios from "axios";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, email, password },
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      window.location.href = "/";
    } catch (err) {
      console.error("Google sign-in error:", err.code, err.message);
      if (err.code === "auth/popup-closed-by-user") return;
      setError(err.message || "Google sign-in failed.");
    }
  };

  const handleFacebook = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      window.location.href = "/";
    } catch (err) {
      console.error("Facebook sign-in error:", err.code, err.message);
      if (err.code === "auth/popup-closed-by-user") return;
      setError(err.message || "Facebook sign-in failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">💰</div>
          <span className="auth-logo-text">Money<span>Map</span></span>
        </div>

        <h2 className="auth-title">Create an account</h2>
        <p className="auth-subtitle">Start tracking your finances today</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <input
              type="text"
              className="auth-input"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Create Account"}
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <div className="auth-oauth-row">
          <button onClick={handleGoogle} className="auth-oauth-btn">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 35c-5.311 0-9.816-3.317-11.534-7.849l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Google
          </button>
          <button onClick={handleFacebook} className="auth-oauth-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.532-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <p className="auth-switch">
          Already have an account?{" "}
          <a href="/login" className="auth-link">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
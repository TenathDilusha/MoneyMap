import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AuthWrapper = ({ children }) => {
  const [status, setStatus] = useState("loading"); // loading | ok | unauth

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => {
        // Refresh user data in localStorage from server
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setStatus("ok");
      })
      .catch(() => {
        localStorage.removeItem("user");
        setStatus("unauth");
      });
  }, []);

  if (status === "loading") return null;
  if (status === "unauth") return <Navigate to="/login" />;
  return children;
};

export default AuthWrapper;
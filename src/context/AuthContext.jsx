import React, { createContext, useState, useEffect } from "react";
import { API } from "../config";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Fetch current user profile if token exists
  const fetchProfile = async (authToken) => {
    try {
      const res = await fetch(`${API}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const safeParseJSON = async (res) => {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    } catch {
      return {};
    }
  };

  const login = async (aadharCardNumber, password) => {
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadharCardNumber, password }),
      });
      const data = await safeParseJSON(res);
      if (!res.ok) {
        throw new Error(
          data.message ||
            (res.status >= 500
              ? "Server error. Please make sure the backend server (npm run dev) is running."
              : "Login failed")
        );
      }
      localStorage.setItem("token", data.token);
      setToken(data.token);
      return data;
    } catch (err) {
      if (err.name === "TypeError") {
        throw new Error("Unable to connect to backend server. Please make sure 'npm run dev' is running.");
      }
      throw err;
    }
  };

  const signup = async (userData) => {
    try {
      const res = await fetch(`${API}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await safeParseJSON(res);
      if (!res.ok) {
        throw new Error(
          data.message ||
            (res.status >= 500
              ? "Server error. Please make sure MongoDB is connected and backend server (npm run dev) is running."
              : "Signup failed")
        );
      }
      localStorage.setItem("token", data.token);
      setToken(data.token);
      return data;
    } catch (err) {
      if (err.name === "TypeError") {
        throw new Error("Unable to connect to backend server. Please make sure 'npm run dev' is running.");
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const refreshProfile = () => {
    if (token) fetchProfile(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

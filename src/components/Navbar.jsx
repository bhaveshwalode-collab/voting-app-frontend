import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Vote, BarChart3, Shield, User, LogOut, Lock } from "lucide-react";

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="glass-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab("candidates")}>
          <div className="brand-icon">
            <Vote size={24} color="#6366f1" />
          </div>
          <div className="brand-text">
            <span className="brand-title">E-VOTE</span>
            <span className="brand-subtitle">Digital Governance</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        {user && (
          <nav className="nav-menu">
            <button
              className={`nav-item ${activeTab === "candidates" ? "active" : ""}`}
              onClick={() => setActiveTab("candidates")}
            >
              <Vote size={18} />
              <span>Candidates</span>
            </button>

            <button
              className={`nav-item ${activeTab === "results" ? "active" : ""}`}
              onClick={() => setActiveTab("results")}
            >
              <BarChart3 size={18} />
              <span>Live Results</span>
            </button>

            {user.role === "admin" && (
              <button
                className={`nav-item ${activeTab === "admin" ? "active" : ""}`}
                onClick={() => setActiveTab("admin")}
              >
                <Shield size={18} />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>
          </nav>
        )}

        {/* User Info / Actions */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-profile-badge">
              <div className="user-meta">
                <span className="user-name">{user.name}</span>
                <span className={`badge ${user.role === "admin" ? "badge-admin" : "badge-voter"}`}>
                  {user.role === "admin" ? "ADMIN" : user.isVoted ? "VOTED" : "VOTER"}
                </span>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={logout} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className={`btn ${activeTab === "login" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setActiveTab("login")}
              >
                <Lock size={16} />
                <span>Login</span>
              </button>
              <button
                className={`btn ${activeTab === "register" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setActiveTab("register")}
              >
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

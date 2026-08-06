import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User, Mail, Phone, MapPin, CreditCard, Lock, CheckCircle2, Shield, AlertCircle, Key } from "lucide-react";

export const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${API}/api/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        setMessage({ text: "Password updated successfully!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setMessage({ text: data.message || "Failed to update password", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Server error occurred", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Voter Profile & Security</h1>
          <p className="page-subtitle">Inspect your credentials and update security settings</p>
        </div>
      </div>

      <div className="admin-grid">
        {/* Profile Info Card */}
        <div className="glass-card profile-details-card">
          <div className="profile-top">
            <div className="candidate-avatar large">
              <User size={48} color="#6366f1" />
            </div>
            <div>
              <h2>{user.name}</h2>
              <div className="badge-row">
                <span className={`badge ${user.role === "admin" ? "badge-admin" : "badge-voter"}`}>
                  {user.role}
                </span>
                <span className={`badge ${user.isVoted ? "badge-voted" : "badge-pending"}`}>
                  {user.isVoted ? "Vote Cast" : "Not Voted Yet"}
                </span>
              </div>
            </div>
          </div>

          <div className="info-list">
            <div className="info-item">
              <CreditCard size={18} className="info-icon" />
              <div>
                <span className="info-label">Aadhar Card Number</span>
                <span className="info-value mono">{user.aadharCardNumber}</span>
              </div>
            </div>

            <div className="info-item">
              <Mail size={18} className="info-icon" />
              <div>
                <span className="info-label">Email Address</span>
                <span className="info-value">{user.email}</span>
              </div>
            </div>

            <div className="info-item">
              <Phone size={18} className="info-icon" />
              <div>
                <span className="info-label">Mobile Number</span>
                <span className="info-value">{user.mobile}</span>
              </div>
            </div>

            <div className="info-item">
              <MapPin size={18} className="info-icon" />
              <div>
                <span className="info-label">Address</span>
                <span className="info-value">{user.address}</span>
              </div>
            </div>

            <div className="info-item">
              <User size={18} className="info-icon" />
              <div>
                <span className="info-label">Age</span>
                <span className="info-value">{user.age} Years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="glass-card profile-password-card">
          <div className="section-header">
            <Key size={22} color="#8b5cf6" />
            <h3>Update Password</h3>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate}>
            <div className="form-group">
              <label>Current Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

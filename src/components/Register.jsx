import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User, Mail, Phone, MapPin, CreditCard, Lock, ArrowRight, AlertCircle, Shield } from "lucide-react";

export const Register = ({ setActiveTab }) => {
  const { signup } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    mobile: "",
    address: "",
    aadharCardNumber: "",
    password: "",
    role: "voter",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup({
        ...formData,
        age: Number(formData.age),
      });
      setActiveTab("candidates");
    } catch (err) {
      setError(err.message || "Registration failed. Check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card wide-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <User size={32} color="#8b5cf6" />
          </div>
          <h2>Create Voter / Admin Account</h2>
          <p>Register with your official details to enable secure voting capabilities</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid-form">
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              className="form-input"
              placeholder="e.g. 24"
              value={formData.age}
              onChange={handleChange}
              min="18"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="name@domain.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <div className="input-with-icon">
              <Phone className="input-icon" size={18} />
              <input
                type="tel"
                name="mobile"
                className="form-input"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Residential Address</label>
            <div className="input-with-icon">
              <MapPin className="input-icon" size={18} />
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="House, Street, City, State"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Aadhar Card Number</label>
            <div className="input-with-icon">
              <CreditCard className="input-icon" size={18} />
              <input
                type="text"
                name="aadharCardNumber"
                className="form-input"
                placeholder="12-digit Aadhar Number"
                value={formData.aadharCardNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Account Role</label>
            <div className="input-with-icon">
              <Shield className="input-icon" size={18} />
              <select
                name="role"
                className="form-input select-input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="voter">Voter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="full-width">
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Creating Account..." : "Register Now"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Already registered?{" "}
            <button className="link-btn" onClick={() => setActiveTab("login")}>
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

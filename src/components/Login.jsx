import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Lock, CreditCard, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export const Login = ({ setActiveTab }) => {
  const { login } = useContext(AuthContext);
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(aadharCardNumber, password);
      setActiveTab("candidates");
    } catch (err) {
      setError(err.message || "Invalid Aadhar Card Number or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <ShieldCheck size={32} color="#6366f1" />
          </div>
          <h2>Welcome Back</h2>
          <p>Login with your verified Aadhar details to participate in voting</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Aadhar Card Number</label>
            <div className="input-with-icon">
              <CreditCard className="input-icon" size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="12-digit Aadhar Number"
                value={aadharCardNumber}
                onChange={(e) => setAadharCardNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Authenticating..." : "Login to Vote"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button className="link-btn" onClick={() => setActiveTab("register")}>
              Register as Voter / Admin
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useContext, useEffect } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { VotingDashboard } from "./components/VotingDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { Results } from "./components/Results";
import { Profile } from "./components/Profile";
import "./App.css";

const MainContent = () => {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("candidates");

  useEffect(() => {
    if (!loading && !user) {
      if (activeTab !== "register" && activeTab !== "results") {
        setActiveTab("login");
      }
    } else if (!loading && user) {
      if (activeTab === "login" || activeTab === "register") {
        setActiveTab("candidates");
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="glass-card loading-state">
          <div className="spin" style={{ width: 40, height: 40, border: "4px solid #6366f1", borderTopColor: "transparent", borderRadius: "50%" }}></div>
          <p>Initializing Secure Voting System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === "login" && <Login setActiveTab={setActiveTab} />}
        {activeTab === "register" && <Register setActiveTab={setActiveTab} />}
        {activeTab === "candidates" && user && <VotingDashboard />}
        {activeTab === "admin" && user && user.role === "admin" && <AdminPanel />}
        {activeTab === "results" && <Results />}
        {activeTab === "profile" && user && <Profile />}
      </main>

      <footer className="footer">
        <p>© 2026 E-Vote Digital Governance Platform. Built with Node.js & React.js</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

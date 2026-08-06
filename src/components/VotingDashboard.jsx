import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Vote, CheckCircle2, AlertTriangle, Search, Flag, User, Sparkles, Check, RefreshCw } from "lucide-react";

export const VotingDashboard = () => {
  const { user, token, refreshProfile } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const safeParseJSON = async (res) => {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    } catch {
      return {};
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await safeParseJSON(res);
        if (Array.isArray(data)) setCandidates(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCandidates();
    }
  }, [token]);

  const handleVote = async () => {
    if (!selectedCandidate) return;
    setVoting(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${API}/api/candidates/vote/${selectedCandidate._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeParseJSON(res);

      if (res.ok) {
        setMessage({ text: "Vote cast successfully! Thank you for exercising your right.", type: "success" });
        refreshProfile();
        fetchCandidates();
        setSelectedCandidate(null);
      } else {
        setMessage({ text: data.message || "Failed to cast vote", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Server error occurred while voting.", type: "error" });
    } finally {
      setVoting(false);
    }
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.party.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Digital Ballot Portal</h1>
          <p className="page-subtitle">Cast your official vote securely. Every vote matters.</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchCandidates} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* User Voting Status Notification Banner */}
      {user?.isVoted ? (
        <div className="status-banner banner-success glass-card">
          <div className="banner-icon">
            <CheckCircle2 size={32} color="#10b981" />
          </div>
          <div>
            <h3>You Have Successfully Voted!</h3>
            <p>Your vote has been securely recorded in the system. You cannot cast another vote in this election.</p>
          </div>
        </div>
      ) : user?.role === "admin" ? (
        <div className="status-banner banner-warning glass-card">
          <div className="banner-icon">
            <AlertTriangle size={32} color="#f59e0b" />
          </div>
          <div>
            <h3>Admin Account Notice</h3>
            <p>You are logged in as an Administrator. Admins are restricted from casting votes. Use the Admin Panel to manage candidates.</p>
          </div>
        </div>
      ) : (
        <div className="status-banner banner-info glass-card">
          <div className="banner-icon">
            <Sparkles size={32} color="#6366f1" />
          </div>
          <div>
            <h3>Eligible to Vote</h3>
            <p>Select a candidate below and click "Cast Vote". Your decision will be anonymously recorded.</p>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="filter-bar glass-card">
        <div className="input-with-icon search-input">
          <Search className="input-icon" size={18} />
          <input
            type="text"
            className="form-input"
            placeholder="Search candidate by name or party..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="candidate-count">
          Showing <strong>{filteredCandidates.length}</strong> Candidates
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {loading ? (
        <div className="loading-state glass-card">
          <RefreshCw size={32} className="spin" color="#6366f1" />
          <p>Loading candidate list...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="empty-state glass-card">
          <Vote size={48} color="#64748b" />
          <h3>No Candidates Found</h3>
          <p>There are no candidates matching your query or added by the administrator yet.</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {filteredCandidates.map((candidate) => (
            <div key={candidate._id} className="candidate-card glass-card">
              <div className="candidate-badge-wrapper">
                <span className="party-badge">
                  <Flag size={14} />
                  {candidate.party}
                </span>
              </div>

              <div className="candidate-avatar">
                <User size={36} color="#8b5cf6" />
              </div>

              <h3 className="candidate-name">{candidate.name}</h3>
              <p className="candidate-meta">Age: {candidate.age} Years</p>

              <div className="candidate-action">
                <button
                  className="btn btn-primary btn-block"
                  disabled={user?.isVoted || user?.role === "admin"}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <Vote size={18} />
                  <span>{user?.isVoted ? "Already Voted" : "Cast Vote"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedCandidate && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <Vote size={32} color="#6366f1" />
              <h2>Confirm Your Vote</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cast your official vote for:</p>
              <div className="candidate-confirm-box">
                <div className="candidate-avatar mini">
                  <User size={24} color="#8b5cf6" />
                </div>
                <div>
                  <h4>{selectedCandidate.name}</h4>
                  <span className="party-text">{selectedCandidate.party}</span>
                </div>
              </div>
              <p className="warning-text">
                ⚠️ This action is final and cannot be undone or changed later.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedCandidate(null)}
                disabled={voting}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleVote} disabled={voting}>
                {voting ? "Submitting Vote..." : "Confirm & Cast Vote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Shield, PlusCircle, Trash2, Users, Flag, User, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { API } from "../config";

export const AdminPanel = () => {
  const { token } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [age, setAge] = useState("");

  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [adding, setAdding] = useState(false);
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
    setLoadingCandidates(true);
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
      setLoadingCandidates(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await safeParseJSON(res);
        setUsers(data.users || []);
        setTotalUsers(data.totalUsers || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCandidates();
      fetchUsers();
    }
  }, [token]);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setAdding(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${API}/api/candidates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, party, age: Number(age) }),
      });
      const data = await safeParseJSON(res);

      if (res.ok) {
        setMessage({ text: `Candidate "${name}" added successfully!`, type: "success" });
        setName("");
        setParty("");
        setAge("");
        fetchCandidates();
      } else {
        setMessage({ text: data.message || "Failed to add candidate", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Server error occurred", type: "error" });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCandidate = async (id, candidateName) => {
    if (!window.confirm(`Are you sure you want to delete candidate "${candidateName}"?`)) return;

    try {
      const res = await fetch(`${API}/api/candidates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeParseJSON(res);

      if (res.ok) {
        setMessage({ text: `Candidate deleted successfully`, type: "success" });
        fetchCandidates();
      } else {
        setMessage({ text: data.message || "Failed to delete candidate", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Server error occurred", type: "error" });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Management Panel</h1>
          <p className="page-subtitle">Manage election candidates and monitor registered voter database</p>
        </div>
        <div className="header-badges">
          <span className="badge badge-admin">ADMIN ACCESS</span>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="admin-grid">
        {/* Add Candidate Form */}
        <div className="admin-section glass-card">
          <div className="section-header">
            <PlusCircle size={22} color="#6366f1" />
            <h3>Add New Candidate</h3>
          </div>

          <form onSubmit={handleAddCandidate}>
            <div className="form-group">
              <label>Candidate Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Political Party / Affiliation</label>
              <div className="input-with-icon">
                <Flag className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Progressive Voters Front"
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 45"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="21"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={adding}>
              {adding ? "Adding Candidate..." : "Create Candidate Entry"}
            </button>
          </form>
        </div>

        {/* Existing Candidates List */}
        <div className="admin-section glass-card">
          <div className="section-header">
            <Shield size={22} color="#8b5cf6" />
            <h3>Existing Candidates ({candidates.length})</h3>
          </div>

          {loadingCandidates ? (
            <div className="loading-state">
              <RefreshCw size={24} className="spin" color="#8b5cf6" />
            </div>
          ) : candidates.length === 0 ? (
            <p className="text-muted">No candidates registered yet.</p>
          ) : (
            <div className="admin-candidates-list">
              {candidates.map((c) => (
                <div key={c._id} className="admin-candidate-item">
                  <div className="candidate-info">
                    <strong>{c.name}</strong>
                    <span className="party-subtext">{c.party} ({c.age} yrs)</span>
                  </div>
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={() => handleDeleteCandidate(c._id, c.name)}
                    title="Delete Candidate"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Voter Database List */}
      <div className="admin-section glass-card margin-top">
        <div className="section-header space-between">
          <div className="flex-align">
            <Users size={22} color="#ec4899" />
            <h3>Registered Users Roster ({totalUsers})</h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchUsers}>
            <RefreshCw size={14} className={loadingUsers ? "spin" : ""} />
            <span>Refresh Users</span>
          </button>
        </div>

        {loadingUsers ? (
          <div className="loading-state">
            <RefreshCw size={24} className="spin" color="#ec4899" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted">No users found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Aadhar Card</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Voting Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong>{u.name}</strong>
                    </td>
                    <td className="mono">{u.aadharCardNumber}</td>
                    <td>{u.email}</td>
                    <td>{u.mobile}</td>
                    <td>
                      <span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-voter"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.isVoted ? "badge-voted" : "badge-pending"}`}>
                        {u.isVoted ? "Voted" : "Not Voted"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

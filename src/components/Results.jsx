import React, { useState, useEffect } from "react";
import { BarChart3, Trophy, Crown, RefreshCw, Flag, Award, TrendingUp } from "lucide-react";

export const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/candidates/results`);
      if (res.ok) {
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        if (Array.isArray(data)) setResults(data);
      }
    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // Auto-refresh every 10 seconds for live updates
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalVotesCast = results.reduce((acc, curr) => acc + (curr.voteCount || 0), 0);
  const leadingCandidate = results.length > 0 ? results[0] : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Live Election Results</h1>
          <p className="page-subtitle">Real-time vote tallies and leader standings automatically updated</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchResults} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          <span>Refresh Results</span>
        </button>
      </div>

      {/* Leader Showcase Card */}
      {leadingCandidate && leadingCandidate.voteCount > 0 && (
        <div className="leader-card glass-card">
          <div className="leader-crown-badge">
            <Crown size={28} color="#f59e0b" />
          </div>
          <div className="leader-content">
            <span className="leader-tag">CURRENT LEADER</span>
            <h2 className="leader-name">{leadingCandidate.name}</h2>
            <div className="leader-meta">
              <span className="party-badge">
                <Flag size={14} />
                {leadingCandidate.party}
              </span>
              <span className="leader-votes">
                <Trophy size={16} color="#f59e0b" />
                <strong>{leadingCandidate.voteCount}</strong> Votes Cast
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Total Stats Bar */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon">
            <TrendingUp size={24} color="#6366f1" />
          </div>
          <div>
            <span className="stat-label">Total Votes Recorded</span>
            <h3 className="stat-value">{totalVotesCast}</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">
            <Award size={24} color="#8b5cf6" />
          </div>
          <div>
            <span className="stat-label">Participating Candidates</span>
            <h3 className="stat-value">{results.length}</h3>
          </div>
        </div>
      </div>

      {/* Results Leaderboard List */}
      <div className="results-section glass-card">
        <div className="section-header">
          <BarChart3 size={22} color="#6366f1" />
          <h3>Vote Distribution & Standings</h3>
        </div>

        {loading && results.length === 0 ? (
          <div className="loading-state">
            <RefreshCw size={28} className="spin" color="#6366f1" />
            <p>Loading election results...</p>
          </div>
        ) : results.length === 0 ? (
          <p className="text-muted">No election results recorded yet.</p>
        ) : (
          <div className="results-list">
            {results.map((candidate, index) => {
              const votePercent =
                totalVotesCast > 0
                  ? Math.round((candidate.voteCount / totalVotesCast) * 100)
                  : 0;

              return (
                <div key={candidate._id || index} className="result-item">
                  <div className="result-rank">
                    {index === 0 && candidate.voteCount > 0 ? (
                      <Crown size={20} color="#f59e0b" />
                    ) : (
                      <span>#{index + 1}</span>
                    )}
                  </div>

                  <div className="result-info-wrapper">
                    <div className="result-header">
                      <div>
                        <span className="result-candidate-name">{candidate.name}</span>
                        <span className="party-subtext">{candidate.party}</span>
                      </div>
                      <div className="result-count">
                        <strong>{candidate.voteCount}</strong> Votes ({votePercent}%)
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="progress-bar-track">
                      <div
                        className={`progress-bar-fill ${index === 0 ? "leader-bar" : ""}`}
                        style={{ width: `${votePercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

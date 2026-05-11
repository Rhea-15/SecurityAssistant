import React from 'react';

function Dashboard({ stats }) {
  return (
    <div className="dashboard">
      <div className="header">
        <h1>🔒 Security SOC Assistant</h1>
        <p>Enterprise Threat Detection & Response</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.incidents}</div>
          <div className="stat-label">Incidents Analyzed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.threats}</div>
          <div className="stat-label">Active Threats</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.high_severity}</div>
          <div className="stat-label">Critical Alerts</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
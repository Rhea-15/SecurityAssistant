import React from 'react';

function CorrelationView({ correlation }) {
  if (!correlation) {
    return (
      <div className="correlation-container">
        <h2>🔗 Log Correlation Analysis</h2>
        <p>No correlation data available</p>
      </div>
    );
  }

  return (
    <div className="correlation-container">
      <h2>🔗 Log Correlation Analysis</h2>

      <div className="correlation-stats">
        <div className="stat">
          <div className="stat-num">{correlation.total_logs || 0}</div>
          <div className="stat-text">Total Logs Analyzed</div>
        </div>
        <div className="stat">
          <div className="stat-num">{correlation.unique_ips || 0}</div>
          <div className="stat-text">Unique Source IPs</div>
        </div>
        <div className="stat">
          <div className="stat-num">{correlation.patterns?.length || 0}</div>
          <div className="stat-text">Threat Patterns Detected</div>
        </div>
      </div>

      {correlation.patterns && correlation.patterns.length > 0 ? (
        <div className="patterns-list">
          <h3>🚨 Detected Attack Patterns</h3>
          {correlation.patterns.map((pattern, idx) => (
            <div 
              key={idx} 
              className={`pattern-card severity-${(pattern.severity || 'MEDIUM').toLowerCase()}`}
            >
              <div className="pattern-type">
                {pattern.type}
              </div>
              <div className="pattern-description">
                {pattern.description}
              </div>
              <div className="pattern-details">
                <span className="pattern-count">Count: {pattern.count}</span>
                <span className="pattern-severity">Severity: {pattern.severity}</span>
                {pattern.source_ip && <span className="pattern-ip">Source IP: {pattern.source_ip}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="info-box">
          <p>✓ No suspicious patterns detected in logs</p>
        </div>
      )}
    </div>
  );
}

export default CorrelationView;
import React from 'react';
import { getSeverityColor, copyToClipboard } from '../utils/formatters';

function AnalysisResults({ analysis }) {
  if (!analysis) {
    return (
      <div className="analysis-container">
        <h2>🤖 Analysis</h2>
        <p>No analysis data available</p>
      </div>
    );
  }

  // Ensure mitigation_steps is always an array
  const steps = Array.isArray(analysis.mitigation_steps) 
    ? analysis.mitigation_steps 
    : [analysis.mitigation_steps];

  return (
    <div className="analysis-container">
      <h2>🤖 Analysis</h2>

      <div className="analysis-section">
        <h3>Executive Summary</h3>
        <div className="summary-box">
          {analysis.summary || 'Analysis in progress...'}
        </div>
      </div>

      <div className="analysis-section">
        <h3>🔍 Threat Assessment</h3>
        <div className="assessment-box">
          {analysis.threat_assessment || 'Assessing threat level...'}
        </div>
      </div>

      <div className="analysis-section">
        <h3>🚨 Immediate Mitigation Steps</h3>
        <div className="mitigation-box">
          {steps.length > 0 ? (
            <ol>
              {steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          ) : (
            <p>Review incident manually</p>
          )}
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => copyToClipboard(steps)}
        >
          📋 Copy Steps
        </button>
      </div>

      <div className="analysis-section">
        <h3>📝 Explanation (Non-Technical)</h3>
        <div className="explanation-box">
          {analysis.explanation || 'Analysis in progress...'}
        </div>
      </div>

      <div className="analysis-section">
        <div 
          className="severity-badge" 
          style={{
            background: getSeverityColor(analysis.recommended_severity)
          }}
        >
          Recommended Severity: <strong>{analysis.recommended_severity}</strong>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResults;
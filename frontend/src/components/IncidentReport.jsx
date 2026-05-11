import React from 'react';

function IncidentReport({ report, analysis }) {
  if (!report) {
    return (
      <div className="report-container">
        <h2>📋 Incident Report</h2>
        <p>Generating report...</p>
      </div>
    );
  }

  const handleExport = () => {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${report.id.substring(0, 8)}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="report-container">
      <h2>📋 Incident Report</h2>

      <div className="report-meta">
        <p><strong>Report ID:</strong> <code>{report.id.substring(0, 12)}...</code></p>
        <p><strong>Generated:</strong> {new Date(report.timestamp_generated).toLocaleString()}</p>
        <p><strong>Logs Analyzed:</strong> {report.logs_analyzed}</p>
        <p><strong>Source File:</strong> {report.source_file}</p>
      </div>

      {analysis && (
        <div className="report-content">
          <div className="report-section">
            <h3>📊 Analysis Summary</h3>
            <div className="report-summary">{analysis.summary}</div>
          </div>

          <div className="report-section">
            <h3>🎯 Threat Assessment</h3>
            <div className="report-assessment">{analysis.threat_assessment}</div>
          </div>

          <div className="report-section">
            <h3>✅ Recommended Actions</h3>
            <div className="report-actions">
              {Array.isArray(analysis.mitigation_steps) ? (
                <ol>
                  {analysis.mitigation_steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p>{analysis.mitigation_steps}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="report-actions-btn">
        <button className="btn btn-primary" onClick={handleExport}>
          📥 Download JSON Report
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨️ Print Report
        </button>
      </div>
    </div>
  );
}

export default IncidentReport;
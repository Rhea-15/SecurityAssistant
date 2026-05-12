import React from 'react';

function IncidentReport({ report, analysis }) {
  if (!report) return null;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soc-report-${report.id.substring(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const meta = [
    { label: 'Report ID', value: report.id.substring(0, 16) + '…' },
    { label: 'Generated', value: new Date(report.timestamp_generated).toLocaleString() },
    { label: 'Logs Analyzed', value: report.logs_analyzed },
    { label: 'Source', value: report.source_file || 'N/A' },
  ];

  return (
    <div className="panel fade-in" style={{ padding: '28px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="section-tag" style={{ marginBottom: 6 }}>Report</div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Incident Report</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="pulse-dot" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-green)', letterSpacing: '0.08em' }}>
            COMPLETE
          </span>
        </div>
      </div>

      {/* Metadata table */}
      <div className="terminal" style={{ marginBottom: 24 }}>
        {meta.map(m => (
          <div key={m.label} style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
            <span className="t-dim" style={{ minWidth: 130, fontSize: 11 }}>{m.label.toUpperCase()}:</span>
            <span className="t-cyan">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Analysis sections */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Summary', val: analysis.summary, border: 'var(--accent-cyan)' },
            { label: 'Threat Assessment', val: analysis.threat_assessment, border: 'var(--accent-red)' },
          ].map(sec => (
            <div key={sec.label}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                ▸ {sec.label}
              </div>
              <p style={{
                padding: '14px 16px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
                background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)', borderLeft: `3px solid ${sec.border}`,
              }}>
                {sec.val}
              </p>
            </div>
          ))}

          {/* Actions */}
          {analysis.mitigation_steps?.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                ▸ Recommended Actions
              </div>
              <div className="terminal">
                {(Array.isArray(analysis.mitigation_steps) ? analysis.mitigation_steps : [analysis.mitigation_steps]).map((s, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <span className="t-cyan">[{String(i + 1).padStart(2, '0')}]</span>{' '}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
        <button className="btn btn-primary" onClick={handleExport}>
          ↓ Download Report
        </button>
        <button className="btn btn-ghost" onClick={() => window.print()}>
          ⎙ Print
        </button>
      </div>
    </div>
  );
}

export default IncidentReport;
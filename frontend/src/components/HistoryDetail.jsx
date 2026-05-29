import React, { useState } from 'react';
import { getSeverityColor } from '../utils/formatters';

const SEV_COLOR = {
  CRITICAL: 'var(--accent-red)',
  HIGH:     'var(--accent-orange)',
  MEDIUM:   'var(--accent-yellow)',
  LOW:      'var(--accent-green)',
};

const typeIcon = (type = '') => {
  if (type.includes('BRUTE'))  return '⚡';
  if (type.includes('PORT'))   return '◎';
  if (type.includes('RECON'))  return '⬡';
  if (type.includes('DDOS'))   return '⬢';
  return '◈';
};

const chipClass = (sev = '') => {
  const s = sev.toUpperCase();
  if (s === 'CRITICAL') return 'chip chip-critical';
  if (s === 'HIGH')     return 'chip chip-high';
  if (s === 'MEDIUM')   return 'chip chip-medium';
  return 'chip chip-low';
};

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
        letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ color: 'var(--accent-cyan)' }}>▸</span> {label}
      </div>
      {children}
    </div>
  );
}

function HistoryDetail({ entry, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { analysis, correlation, report, filename, timestamp, parsedCount, severity } = entry;
  const sevColor = SEV_COLOR[severity] || 'var(--text-muted)';

  const tabs = [
    { id: 'overview',     label: 'Overview' },
    { id: 'correlation',  label: 'Correlation' },
    { id: 'analysis',     label: 'AI Analysis' },
    { id: 'report',       label: 'Report' },
  ];

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(entry, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soc-history-${entry.id.substring(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Top bar */}
      <div className="panel" style={{ padding: '20px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={onBack} style={{ gap: 6, fontSize: 12 }}>
            ← Back
          </button>
          <div style={{ flex: 1 }}>
            <div className="section-tag" style={{ marginBottom: 4 }}>Historical Record</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {filename}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {severity && (
              <div style={{
                padding: '6px 14px', borderRadius: 'var(--radius-md)',
                background: `${sevColor}20`, border: `1px solid ${sevColor}40`,
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                color: sevColor, letterSpacing: '0.08em',
              }}>
                {severity}
              </div>
            )}
            <button className="btn btn-ghost" onClick={handleExport} style={{ fontSize: 11 }}>
              ↓ Export
            </button>
          </div>
        </div>

        {/* Meta strip */}
        <div style={{
          display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 16,
          paddingTop: 16, borderTop: '1px solid var(--border-subtle)',
        }}>
          {[
            { label: 'Analyzed', value: new Date(timestamp).toLocaleString() },
            { label: 'Logs',     value: parsedCount },
            { label: 'Patterns', value: correlation?.patterns?.length ?? 0 },
            { label: 'Unique IPs', value: correlation?.unique_ips ?? 0 },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 2 }}>
                {m.label.toUpperCase()}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-cyan)', fontWeight: 700 }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        background: 'var(--bg-surface)', padding: 4,
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '8px 16px', border: 'none', cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'all var(--transition)',
              background: activeTab === tab.id ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === tab.id ? 'var(--bg-void)' : 'var(--text-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="panel fade-in" style={{ padding: '28px 32px' }}>
          <Section label="Incident Summary">
            <p style={{
              padding: '16px 18px', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7,
              background: 'rgba(0,212,255,0.05)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-cyan)',
            }}>
              {analysis?.summary || 'No summary available.'}
            </p>
          </Section>

          <Section label="Threat Assessment">
            <p style={{
              padding: '16px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
              background: 'rgba(255,61,90,0.05)', border: '1px solid rgba(255,61,90,0.15)',
              borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-red)',
            }}>
              {analysis?.threat_assessment || 'No assessment available.'}
            </p>
          </Section>

          <Section label="Plain Language Explanation">
            <p style={{
              padding: '16px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
              background: 'rgba(155,93,229,0.05)', border: '1px solid rgba(155,93,229,0.15)',
              borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-purple)',
            }}>
              {analysis?.explanation || 'No explanation available.'}
            </p>
          </Section>

          {analysis?.mitigation_steps?.length > 0 && (
            <Section label="Mitigation Steps">
              <div className="terminal">
                {(Array.isArray(analysis.mitigation_steps) ? analysis.mitigation_steps : [analysis.mitigation_steps]).map((step, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <span className="t-cyan">[{String(i + 1).padStart(2, '0')}]</span>{' '}
                    {step}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {activeTab === 'correlation' && (
        <div className="panel fade-in" style={{ padding: '28px 32px' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { label: 'Logs Analyzed', value: correlation?.total_logs ?? 0 },
              { label: 'Unique IPs',    value: correlation?.unique_ips ?? 0 },
              { label: 'Patterns',      value: correlation?.patterns?.length ?? 0 },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '16px 20px', background: 'rgba(0,0,0,0.3)',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>
                  {String(s.value).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <Section label="Detected Patterns">
            {correlation?.patterns?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {correlation.patterns.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    padding: '16px 20px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: p.severity === 'CRITICAL' ? 'rgba(255,61,90,0.05)' :
                                p.severity === 'HIGH'     ? 'rgba(255,140,66,0.05)' :
                                p.severity === 'MEDIUM'   ? 'rgba(255,209,102,0.05)' : 'rgba(0,255,136,0.03)',
                  }}>
                    <div style={{ fontSize: 24, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>
                      {typeIcon(p.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                          {p.type}
                        </span>
                        <span className={chipClass(p.severity)}>{p.severity}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                        {p.description}
                      </p>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {p.count && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>COUNT: {p.count}</span>}
                        {p.source_ip && <span className="ip-tag">{p.source_ip}</span>}
                        {p.ports && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>PORTS: {p.ports.slice(0, 5).join(', ')}{p.ports.length > 5 ? '…' : ''}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '24px', textAlign: 'center',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                background: 'var(--accent-green-dim)',
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                <p style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                  No suspicious patterns detected
                </p>
              </div>
            )}
          </Section>

          {/* IP breakdown */}
          {correlation?.by_ip && Object.keys(correlation.by_ip).length > 0 && (
            <Section label="IP Activity Breakdown">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(correlation.by_ip).map(([ip, ipLogs]) => {
                  const actions = [...new Set(ipLogs.map(l => l.action))].filter(Boolean);
                  return (
                    <div key={ip} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 16px', background: 'rgba(0,0,0,0.25)',
                      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                      flexWrap: 'wrap', gap: 8,
                    }}>
                      <span className="ip-tag">{ip}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                        {ipLogs.length} events
                      </span>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {actions.slice(0, 4).map(a => (
                          <span key={a} style={{
                            fontFamily: 'var(--font-mono)', fontSize: 10,
                            padding: '2px 6px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                          }}>{a}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="panel fade-in" style={{ padding: '28px 32px' }}>
          <Section label="Executive Summary">
            <p style={{
              padding: '16px 18px', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7,
              background: 'rgba(0,212,255,0.05)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-cyan)',
            }}>
              {analysis?.summary || '—'}
            </p>
          </Section>

          <Section label="Threat Assessment">
            <p style={{
              padding: '16px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
              background: 'rgba(255,61,90,0.05)', border: '1px solid rgba(255,61,90,0.15)',
              borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-red)',
            }}>
              {analysis?.threat_assessment || '—'}
            </p>
          </Section>

          {analysis?.mitigation_steps?.length > 0 && (
            <Section label="Mitigation Steps">
              <div className="terminal">
                {(Array.isArray(analysis.mitigation_steps) ? analysis.mitigation_steps : [analysis.mitigation_steps]).map((step, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <span className="t-cyan">[{String(i + 1).padStart(2, '0')}]</span>{' '}
                    {step}
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section label="Plain Language Explanation">
            <p style={{
              padding: '16px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
              background: 'rgba(155,93,229,0.05)', border: '1px solid rgba(155,93,229,0.15)',
              borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-purple)',
            }}>
              {analysis?.explanation || '—'}
            </p>
          </Section>

          {analysis?.recommended_severity && (
            <Section label="Severity Rating">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '14px 20px', borderRadius: 'var(--radius-md)',
                background: `${sevColor}15`, border: `1px solid ${sevColor}30`,
              }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: sevColor, boxShadow: `0 0 8px ${sevColor}` }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: sevColor }}>
                  {analysis.recommended_severity}
                </span>
              </div>
            </Section>
          )}
        </div>
      )}

      {activeTab === 'report' && (
        <div className="panel fade-in" style={{ padding: '28px 32px' }}>
          <Section label="Report Metadata">
            <div className="terminal">
              {[
                { label: 'REPORT ID',  value: report?.id || entry.id },
                { label: 'GENERATED',  value: report?.timestamp_generated ? new Date(report.timestamp_generated).toLocaleString() : new Date(timestamp).toLocaleString() },
                { label: 'SOURCE',     value: report?.source_file || filename },
                { label: 'LOGS',       value: report?.logs_analyzed ?? parsedCount },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
                  <span className="t-dim" style={{ minWidth: 130, fontSize: 11 }}>{m.label}:</span>
                  <span className="t-cyan" style={{ wordBreak: 'break-all' }}>{m.value}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section label="Raw Report Data">
            <div className="terminal" style={{ maxHeight: 320, overflowY: 'auto', fontSize: 11, lineHeight: 1.6 }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--accent-green)' }}>
                {JSON.stringify({ analysis, correlation: { total_logs: correlation?.total_logs, unique_ips: correlation?.unique_ips, patterns: correlation?.patterns }, report }, null, 2)}
              </pre>
            </div>
          </Section>

          <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
            <button className="btn btn-primary" onClick={handleExport}>↓ Download JSON</button>
            <button className="btn btn-ghost" onClick={() => window.print()}>⎙ Print</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryDetail;
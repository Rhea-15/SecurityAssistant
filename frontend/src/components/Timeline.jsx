import React, { useState } from 'react';

const actionColor = (action = '') => {
  const a = action.toUpperCase();
  if (a.match(/FAIL|REJECT|DROP|BLOCK|DENIED/)) return 'var(--accent-red)';
  if (a.match(/ALERT|WARN|SUSPICIOUS/)) return 'var(--accent-orange)';
  if (a.match(/ACCEPT|ALLOW|SUCCESS/)) return 'var(--accent-green)';
  return 'var(--accent-cyan)';
};

function Timeline({ logs }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const visible = expanded ? sorted : sorted.slice(0, 6);

  return (
    <div className="panel fade-in" style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div className="section-tag" style={{ marginBottom: 6 }}>Event Stream</div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Activity Timeline</h2>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
          padding: '4px 10px', background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
        }}>
          {sorted.length} events
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: 28 }}>
        {/* Track line */}
        <div style={{
          position: 'absolute', left: 7, top: 8, bottom: 8,
          width: 1, background: 'linear-gradient(to bottom, var(--accent-cyan), var(--accent-purple), transparent)',
          opacity: 0.3,
        }} />

        {visible.map((log, i) => {
          const color = actionColor(log.action);
          return (
            <div key={i} style={{
              display: 'flex', gap: 16, marginBottom: 14, position: 'relative',
              animation: `fadeSlideUp 0.3s ease ${i * 0.04}s both`,
            }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', left: -22, top: 6,
                width: 10, height: 10, borderRadius: '50%',
                background: color, border: `2px solid var(--bg-surface)`,
                boxShadow: `0 0 8px ${color}60`,
                flexShrink: 0,
              }} />

              {/* Content */}
              <div style={{
                flex: 1, padding: '10px 14px',
                background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 8,
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                    color, letterSpacing: '0.04em',
                  }}>
                    {log.action || 'UNKNOWN'}
                  </span>
                  {log.source_ip && <span className="ip-tag">{log.source_ip}</span>}
                  {log.event_type && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      [{log.event_type}]
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length > 6 && (
        <button
          className="btn btn-ghost"
          onClick={() => setExpanded(e => !e)}
          style={{ marginTop: 8, width: '100%', justifyContent: 'center', fontSize: 11 }}
        >
          {expanded ? '▲ Show less' : `▼ Show ${sorted.length - 6} more events`}
        </button>
      )}
    </div>
  );
}

export default Timeline;
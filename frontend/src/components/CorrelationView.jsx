import React from 'react';

const chipClass = (sev = '') => {
  const s = sev.toUpperCase();
  if (s === 'CRITICAL') return 'chip chip-critical';
  if (s === 'HIGH')     return 'chip chip-high';
  if (s === 'MEDIUM')   return 'chip chip-medium';
  return 'chip chip-low';
};

const typeIcon = (type = '') => {
  if (type.includes('BRUTE'))  return '⚡';
  if (type.includes('PORT'))   return '◎';
  if (type.includes('RECON'))  return '⬡';
  if (type.includes('DDOS'))   return '⬢';
  return '◈';
};

function CorrelationView({ correlation }) {
  if (!correlation) return null;

  const statItems = [
    { label: 'Logs Analyzed', value: correlation.total_logs || 0 },
    { label: 'Unique IPs', value: correlation.unique_ips || 0 },
    { label: 'Patterns Found', value: correlation.patterns?.length || 0 },
  ];

  return (
    <div className="panel fade-in" style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <div className="section-tag" style={{ marginBottom: 6 }}>Correlation Engine</div>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Log Correlation Analysis</h2>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {statItems.map((s, i) => (
          <div key={i} style={{
            padding: '16px 20px',
            background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
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

      {/* Patterns */}
      {correlation.patterns?.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 4, textTransform: 'uppercase' }}>
            Detected Threats
          </div>
          {correlation.patterns.map((p, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '16px 20px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: p.severity === 'CRITICAL' ? 'rgba(255,61,90,0.05)' :
                          p.severity === 'HIGH'     ? 'rgba(255,140,66,0.05)' :
                          p.severity === 'MEDIUM'   ? 'rgba(255,209,102,0.05)' : 'rgba(0,255,136,0.03)',
              animation: `fadeSlideUp 0.35s ease ${i * 0.06}s both`,
            }}>
              <div style={{ fontSize: 24, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>
                {typeIcon(p.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                    {p.type}
                  </span>
                  <span className={chipClass(p.severity)}>{p.severity}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {p.description}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {p.count && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                      COUNT: {p.count}
                    </span>
                  )}
                  {p.source_ip && <span className="ip-tag">{p.source_ip}</span>}
                  {p.ports && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                      PORTS: {p.ports.slice(0, 5).join(', ')}{p.ports.length > 5 ? '…' : ''}
                    </span>
                  )}
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
    </div>
  );
}

export default CorrelationView;
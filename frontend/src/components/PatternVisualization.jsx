import React from 'react';

const SEV_CONFIG = {
  CRITICAL: { color: 'var(--accent-red)',    dim: 'rgba(255,61,90,0.07)',   bar: '#ff3d5a' },
  HIGH:     { color: 'var(--accent-orange)', dim: 'rgba(255,140,66,0.07)', bar: '#ff8c42' },
  MEDIUM:   { color: 'var(--accent-yellow)', dim: 'rgba(255,209,102,0.07)', bar: '#ffd166' },
  LOW:      { color: 'var(--accent-green)',  dim: 'rgba(0,255,136,0.07)',  bar: '#00ff88' },
};

function PatternClusters({ clusters }) {
  if (!clusters || clusters.length === 0) return null;

  return (
    <div className="panel fade-in" style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <div className="section-tag" style={{ marginBottom: 6 }}>Pattern Engine</div>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Attack Pattern Clusters</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {clusters.map((cluster, i) => {
          const cfg = SEV_CONFIG[cluster.severity] || SEV_CONFIG.LOW;
          return (
            <div key={i} style={{
              padding: '20px',
              background: cfg.dim,
              borderRadius: 'var(--radius-lg)',
              border: `1px solid ${cfg.color}30`,
              animation: `fadeSlideUp 0.35s ease ${i * 0.07}s both`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Top accent bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: cfg.color, opacity: 0.6,
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                  color: cfg.color, letterSpacing: '0.04em',
                }}>
                  {cluster.type}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700,
                  color: cfg.color, lineHeight: 1,
                }}>
                  {cluster.count}
                </div>
              </div>

              {/* Severity bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                    SEVERITY
                  </span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: cfg.color }}>
                    {cluster.severity}
                  </span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    background: cfg.color,
                    width: cluster.severity === 'CRITICAL' ? '100%' :
                           cluster.severity === 'HIGH'     ? '75%' :
                           cluster.severity === 'MEDIUM'   ? '50%' : '25%',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>

              {/* Instances */}
              {cluster.instances?.length > 0 && (
                <div>
                  {cluster.instances.slice(0, 3).map((inst, j) => (
                    <div key={j} style={{
                      fontSize: 12, color: 'var(--text-secondary)',
                      padding: '5px 0', borderBottom: j < 2 && j < cluster.instances.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      display: 'flex', gap: 8, alignItems: 'flex-start',
                    }}>
                      <span style={{ color: cfg.color, flexShrink: 0, marginTop: 1 }}>›</span>
                      <span>{inst.description}</span>
                    </div>
                  ))}
                  {cluster.instances.length > 3 && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                      +{cluster.instances.length - 3} more instances
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PatternClusters;
import React, { useEffect, useState } from 'react';

const now = () => new Date().toLocaleTimeString('en-US', { hour12: false });

function Dashboard({ stats }) {
  const [time, setTime] = useState(now());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => { setTime(now()); setTick(t => t + 1); }, 1000);
    return () => clearInterval(id);
  }, []);

  const cards = [
    {
      label: 'Incidents Detected',
      value: stats.incidents,
      color: stats.incidents > 0 ? 'var(--accent-red)' : 'var(--accent-green)',
      dimColor: stats.incidents > 0 ? 'var(--accent-red-dim)' : 'var(--accent-green-dim)',
      icon: '⚠',
      pulse: stats.incidents > 0,
      pulseRed: true,
    },
    {
      label: 'Attack Patterns',
      value: stats.threats,
      color: 'var(--accent-cyan)',
      dimColor: 'var(--accent-cyan-dim)',
      icon: '⬡',
      pulse: false,
    },
    {
      label: 'Critical Alerts',
      value: stats.high_severity,
      color: stats.high_severity > 0 ? 'var(--accent-orange)' : 'var(--accent-green)',
      dimColor: stats.high_severity > 0 ? 'var(--accent-orange-dim)' : 'var(--accent-green-dim)',
      icon: '◈',
      pulse: stats.high_severity > 0,
      pulseRed: true,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div className="panel" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div className="pulse-dot" />
              <span className="section-tag">System Online</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(22px, 4vw, 36px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 8,
            }}>
              <span style={{ color: 'var(--accent-cyan)' }}>SEC</span>OPS
              <span style={{ color: 'var(--accent-cyan)', opacity: 0.5 }}>_</span>
              ASSIST
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Threat Detection &amp; Incident Response Platform
            </p>
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.04em' }}>
              {time}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              {new Date().toDateString().toUpperCase()}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              TICK #{String(tick).padStart(4, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map((card, i) => (
          <div key={i} className="panel fade-in" style={{
            padding: '24px 28px',
            background: card.dimColor,
            animationDelay: `${i * 0.08}s`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ fontSize: 22, color: card.color, lineHeight: 1 }}>{card.icon}</span>
              {card.pulse && <div className={`pulse-dot${card.pulseRed ? ' red' : ''}`} />}
            </div>
            <div className="stat-num" style={{ color: card.color, marginBottom: 6 }}>
              {String(card.value).padStart(2, '0')}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
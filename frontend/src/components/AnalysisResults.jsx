import React from 'react';
import { getSeverityColor, copyToClipboard } from '../utils/formatters';

function AnalysisResults({ analysis }) {
  if (!analysis) return null;

  const steps = Array.isArray(analysis.mitigation_steps)
    ? analysis.mitigation_steps
    : [analysis.mitigation_steps].filter(Boolean);

  const sevColor = getSeverityColor(analysis.recommended_severity);

  return (
    <div className="panel fade-in" style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="section-tag" style={{ marginBottom: 6 }}>AI Analysis</div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Threat Intelligence Report</h2>
        </div>
        {analysis.recommended_severity && (
          <div style={{
            padding: '8px 16px', borderRadius: 'var(--radius-md)',
            background: `${sevColor}20`, border: `1px solid ${sevColor}40`,
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            color: sevColor, letterSpacing: '0.08em',
          }}>
            SEV: {analysis.recommended_severity}
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          ▸ Executive Summary
        </div>
        <p style={{
          padding: '16px 18px', background: 'rgba(0,212,255,0.05)',
          border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
          fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7,
          borderLeft: '3px solid var(--accent-cyan)',
        }}>
          {analysis.summary || 'Analysis in progress...'}
        </p>
      </div>

      {/* Threat Assessment */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          ▸ Threat Assessment
        </div>
        <p style={{
          padding: '16px 18px', background: 'rgba(255,61,90,0.05)',
          border: '1px solid rgba(255,61,90,0.15)', borderRadius: 'var(--radius-md)',
          fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
          borderLeft: '3px solid var(--accent-red)',
        }}>
          {analysis.threat_assessment || 'Assessing...'}
        </p>
      </div>

      {/* Mitigation steps */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ▸ Mitigation Steps
          </div>
          <button className="btn btn-ghost" onClick={() => copyToClipboard(steps)} style={{ padding: '4px 10px', fontSize: 10 }}>
            ⎘ Copy
          </button>
        </div>
        <div className="terminal">
          {steps.map((step, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <span className="t-cyan">[{String(i + 1).padStart(2, '0')}]</span>{' '}
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {analysis.explanation && (
        <div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            ▸ Plain Language Explanation
          </div>
          <p style={{
            padding: '16px 18px', background: 'rgba(155,93,229,0.05)',
            border: '1px solid rgba(155,93,229,0.15)', borderRadius: 'var(--radius-md)',
            fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
            borderLeft: '3px solid var(--accent-purple)',
          }}>
            {analysis.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default AnalysisResults;
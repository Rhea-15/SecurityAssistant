import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function LogUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setError(''); }
  };

  const handleSelect = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const uploadLogs = async () => {
    if (!file) { setError('No file selected'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const content = await file.text();
      const resp = await axios.post(`${API_URL}/logs/upload`, { content, filename: file.name });
      setSuccess(`Parsed ${resp.data.parsed_count} log entries`);
      // attach filename to response data before passing up
      onUpload({ ...resp.data, filename: file.name });
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const formats = ['JSON', 'CSV', 'SYSLOG'];

  return (
    <div className="panel fade-in" style={{ padding: '32px' }}>
      <div style={{ marginBottom: 24 }}>
        <div className="section-tag" style={{ marginBottom: 8 }}>Ingest</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Upload Security Logs</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => fileInput.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `1px dashed ${dragging ? 'var(--accent-cyan)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '48px 32px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition)',
          background: dragging ? 'var(--accent-cyan-dim)' : 'rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        {dragging && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, var(--accent-cyan-dim), transparent)',
            pointerEvents: 'none',
          }} />
        )}
        <div style={{ fontSize: 40, marginBottom: 12, lineHeight: 1 }}>⬆</div>
        <p style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
          {dragging ? 'Release to upload' : 'Drop log file here'}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          or click to browse
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {formats.map(f => (
            <span key={f} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
              padding: '3px 8px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)', color: 'var(--text-muted)',
            }}>{f}</span>
          ))}
        </div>

        <input ref={fileInput} type="file" onChange={handleSelect}
          style={{ display: 'none' }} accept=".json,.csv,.log,.txt" />
      </div>

      {/* File info */}
      {file && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: 'var(--accent-cyan-dim)',
          borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📄</span>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-cyan)' }}>
                {file.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {(file.size / 1024).toFixed(2)} KB
              </div>
            </div>
          </div>
          <button onClick={() => setFile(null)} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}>
            ✕
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={uploadLogs} disabled={!file || loading}>
          {loading ? '⟳ Processing...' : '▶ Analyze Logs'}
        </button>
        {file && (
          <button className="btn btn-ghost" onClick={() => setFile(null)}>Clear</button>
        )}
      </div>

      {loading && <div className="loading-bar" style={{ marginTop: 16 }} />}

      {error   && <div className="alert alert-error"   style={{ marginTop: 14 }}>⚠ {error}</div>}
      {success && <div className="alert alert-success" style={{ marginTop: 14 }}>✓ {success}</div>}
    </div>
  );
}

export default LogUploader;
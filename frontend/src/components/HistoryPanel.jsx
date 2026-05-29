import React, { useState, useEffect } from 'react';

const HISTORY_KEY = 'secops_history';

export function saveToHistory(sessionId, filename, parsedCount, analysis, correlation, report) {
  const existing = getHistory();
  const entry = {
    id: sessionId,
    filename: filename || 'Unknown file',
    parsedCount,
    timestamp: new Date().toISOString(),
    severity: analysis?.recommended_severity || null,
    patternCount: correlation?.patterns?.length || 0,
    summary: analysis?.summary || null,
    analysis,
    correlation,
    report,
  };
  const filtered = existing.filter(e => e.id !== sessionId);
  const updated = [entry, ...filtered].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function deleteHistoryEntry(id) {
  const updated = getHistory().filter(e => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

const SEV_COLOR = {
  CRITICAL: 'var(--accent-red)',
  HIGH:     'var(--accent-orange)',
  MEDIUM:   'var(--accent-yellow)',
  LOW:      'var(--accent-green)',
};

function HistoryPanel({ onViewDetail }) {
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // which entry is showing confirm

  useEffect(() => {
    setHistory(getHistory());
  }, [open]);

  const handleClearAll = () => {
    if (!confirmClearAll) {
      setConfirmClearAll(true);
      return;
    }
    clearHistory();
    setHistory([]);
    setConfirmClearAll(false);
  };

  const handleDeleteOne = (e, id) => {
    e.stopPropagation(); // don't trigger the card click / view detail
    if (deletingId === id) {
      // second click = confirmed
      deleteHistoryEntry(id);
      setHistory(getHistory());
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setConfirmClearAll(false); // cancel any pending clear-all
    }
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  const handleEntryClick = (entry) => {
    setOpen(false);
    onViewDetail(entry);
  };

  // clicking outside cancels pending confirms
  const handleBackdropClick = () => {
    setDeletingId(null);
    setConfirmClearAll(false);
    setOpen(false);
  };

  if (!open) {
    const count = getHistory().length;
    return (
      <button
        className="btn btn-ghost"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          gap: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        ◷ History
        {count > 0 && (
          <span style={{
            background: 'var(--accent-cyan)', color: 'var(--bg-void)',
            borderRadius: '50%', width: 18, height: 18,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700,
          }}>{count}</span>
        )}
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        style={{
          position: 'fixed', inset: 0, zIndex: 199,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
        }}
      />

      <div style={{
        position: 'fixed', bottom: 0, right: 0, top: 0,
        width: 'min(440px, 100vw)',
        background: 'var(--bg-deep)',
        borderLeft: '1px solid var(--border-default)',
        zIndex: 200,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
        animation: 'slideInRight 0.25s ease both',
      }}>
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div className="section-tag" style={{ marginBottom: 4 }}>Session Log</div>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Analysis History</h3>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {history.length > 0 && (
              <button
                className="btn btn-ghost"
                onClick={(e) => { e.stopPropagation(); handleClearAll(); }}
                style={{
                  padding: '4px 12px', fontSize: 10,
                  color: confirmClearAll ? 'var(--bg-void)' : 'var(--accent-red)',
                  background: confirmClearAll ? 'var(--accent-red)' : 'transparent',
                  borderColor: 'var(--accent-red)',
                  transition: 'all 0.2s ease',
                }}
              >
                {confirmClearAll ? '⚠ Confirm Clear All' : '✕ Clear All'}
              </button>
            )}
            {confirmClearAll && (
              <button
                className="btn btn-ghost"
                onClick={(e) => { e.stopPropagation(); setConfirmClearAll(false); }}
                style={{ padding: '4px 10px', fontSize: 10 }}
              >
                Cancel
              </button>
            )}
            <button
              className="btn btn-ghost"
              onClick={(e) => { e.stopPropagation(); setOpen(false); setDeletingId(null); setConfirmClearAll(false); }}
              style={{ padding: '4px 10px', fontSize: 11 }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>◷</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>No history yet</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>Completed analyses will appear here</div>
            </div>
          ) : (
            history.map((entry, i) => {
              const sevColor = SEV_COLOR[entry.severity] || 'var(--text-muted)';
              const isDeleting = deletingId === entry.id;

              return (
                <div
                  key={entry.id}
                  onClick={() => !isDeleting && handleEntryClick(entry)}
                  style={{
                    padding: '14px 16px',
                    background: isDeleting ? 'rgba(255,61,90,0.08)' : 'var(--bg-surface)',
                    border: `1px solid ${isDeleting ? 'var(--accent-red)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 10,
                    cursor: isDeleting ? 'default' : 'pointer',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                    animation: `fadeSlideUp 0.3s ease ${i * 0.04}s both`,
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!isDeleting) {
                      e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                      e.currentTarget.style.background = 'var(--bg-elevated)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isDeleting) {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.background = 'var(--bg-surface)';
                    }
                  }}
                >
                  {/* Top row: filename + severity + delete button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                      color: 'var(--text-primary)', flex: 1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      📄 {entry.filename}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {entry.severity && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                          color: sevColor, background: `${sevColor}18`,
                          padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${sevColor}30`,
                        }}>
                          {entry.severity}
                        </span>
                      )}
                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDeleteOne(e, entry.id)}
                        title={isDeleting ? 'Click again to confirm delete' : 'Delete this entry'}
                        style={{
                          background: isDeleting ? 'var(--accent-red)' : 'transparent',
                          border: `1px solid ${isDeleting ? 'var(--accent-red)' : 'var(--border-default)'}`,
                          color: isDeleting ? 'white' : 'var(--text-muted)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '2px 7px',
                          fontSize: 11,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-mono)',
                          transition: 'all 0.2s ease',
                          lineHeight: 1.6,
                        }}
                        onMouseEnter={e => {
                          if (!isDeleting) {
                            e.currentTarget.style.borderColor = 'var(--accent-red)';
                            e.currentTarget.style.color = 'var(--accent-red)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isDeleting) {
                            e.currentTarget.style.borderColor = 'var(--border-default)';
                            e.currentTarget.style.color = 'var(--text-muted)';
                          }
                        }}
                      >
                        {isDeleting ? '⚠ Confirm' : '🗑'}
                      </button>
                    </div>
                  </div>

                  {/* Confirm delete prompt */}
                  {isDeleting && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 10px', marginBottom: 8,
                      background: 'rgba(255,61,90,0.1)', borderRadius: 'var(--radius-sm)',
                      border: '1px dashed rgba(255,61,90,0.3)',
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-red)' }}>
                        Delete this record?
                      </span>
                      <button
                        onClick={cancelDelete}
                        style={{
                          background: 'transparent', border: '1px solid var(--border-default)',
                          color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)',
                          padding: '2px 8px', fontSize: 10, cursor: 'pointer',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Summary */}
                  {entry.summary && !isDeleting && (
                    <p style={{
                      fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5,
                      marginBottom: 10,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {entry.summary}
                    </p>
                  )}

                  {/* Meta row */}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                      {entry.parsedCount} logs
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                      {entry.patternCount} pattern{entry.patternCount !== 1 ? 's' : ''}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      {new Date(entry.timestamp).toLocaleString('en-US', {
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: false,
                      })}
                    </span>
                  </div>

                  {/* Footer row */}
                  {!isDeleting && (
                    <div style={{
                      marginTop: 8, paddingTop: 8,
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9,
                        color: 'var(--text-muted)', letterSpacing: '0.05em',
                      }}>
                        SESSION: {entry.id.substring(0, 18)}…
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 10,
                        color: 'var(--accent-cyan)',
                      }}>
                        View →
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-muted)', flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{history.length} session{history.length !== 1 ? 's' : ''} stored locally • max 20</span>
          {deletingId && (
            <span style={{ color: 'var(--accent-red)', fontSize: 10 }}>
              click ⚠ Confirm to delete
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default HistoryPanel;
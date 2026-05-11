import React from 'react';

function Timeline({ logs }) {
  const sortedLogs = [...logs].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="timeline">
      <h3>📈 Event Timeline</h3>
      <div className="timeline-container">
        {sortedLogs.slice(0, 10).map((log, idx) => (
          <div key={idx} className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <div className="timeline-time">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
              <div className="timeline-action">{log.action || 'LOG'}</div>
              <div className="timeline-ip">IP: {log.source_ip || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
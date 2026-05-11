import React from 'react';

function PatternClusters({ clusters }) {
  if (!clusters || clusters.length === 0) {
    return (
      <div className="clusters-container">
        <h2>🎯 Attack Pattern Clustering</h2>
        <p>No patterns detected</p>
      </div>
    );
  }

  return (
    <div className="clusters-container">
      <h2>🎯 Attack Pattern Clustering</h2>

      <div className="clusters-info">
        <p>Found <strong>{clusters.length}</strong> unique attack patterns</p>
      </div>

      <div className="clusters-grid">
        {clusters.map((cluster, idx) => (
          <div 
            key={idx} 
            className={`cluster-card severity-${(cluster.severity || 'MEDIUM').toLowerCase()}`}
          >
            <div className="cluster-header">
              <h4>{cluster.type}</h4>
              <span className="cluster-count">{cluster.count}</span>
            </div>
            <div className="cluster-severity">{cluster.severity}</div>
            
            {cluster.instances && cluster.instances.length > 0 && (
              <div className="cluster-instances">
                <p><strong>Detected Instances:</strong></p>
                <ul>
                  {cluster.instances.slice(0, 3).map((inst, i) => (
                    <li key={i}>
                      {inst.description}
                      {inst.count && ` (${inst.count}x)`}
                    </li>
                  ))}
                </ul>
                {cluster.instances.length > 3 && (
                  <p className="more-instances">+{cluster.instances.length - 3} more</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatternClusters;
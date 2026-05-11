function clusterAttackPatterns(patterns) {
  const clusters = {};

  patterns.forEach(pattern => {
    const key = pattern.type;
    if (!clusters[key]) {
      clusters[key] = {
        type: key,
        count: 0,
        severity: pattern.severity,
        instances: []
      };
    }
    clusters[key].count++;
    clusters[key].instances.push(pattern);
  });

  return Object.values(clusters).sort((a, b) => b.count - a.count);
}

module.exports = { clusterAttackPatterns };
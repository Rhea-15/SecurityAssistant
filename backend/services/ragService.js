const threatSignatures = [
  {
    name: 'Brute Force Attack',
    keywords: ['failed_login', 'failed login', 'brute force', 'credential'],
    severity: 'CRITICAL',
    description: 'Multiple authentication failures from same source indicating password attack',
    mitigation: ['Block source IP', 'Reset affected user passwords', 'Enable MFA', 'Monitor account lockouts'],
    context: 'Common attack vector targeting weak credentials'
  },
  {
    name: 'Port Scanning',
    keywords: ['port scan', 'drop eth', 'syn_scan', 'port_probe'],
    severity: 'MEDIUM',
    description: 'Network reconnaissance scanning ports to identify services',
    mitigation: ['Block source at perimeter', 'Review firewall rules', 'Disable unnecessary services'],
    context: 'Precursor to exploitation attempts'
  },
  {
    name: 'DDoS Attack',
    keywords: ['ddos', 'flooding', 'syn_flood', 'high traffic'],
    severity: 'CRITICAL',
    description: 'Distributed denial of service attempt overwhelming resources',
    mitigation: ['Activate DDoS mitigation', 'Rate limiting', 'Redirect to CDN', 'Alert ISP'],
    context: 'Disruptive attack aiming at availability'
  },
  {
    name: 'Privilege Escalation',
    keywords: ['sudo', 'escalation', 'privilege', 'elevated access'],
    severity: 'CRITICAL',
    description: 'Attempt to gain higher level access than currently possessed',
    mitigation: ['Review sudo logs', 'Check account permissions', 'Update patches', 'Audit admin accounts'],
    context: 'Post-compromise activity to maintain access'
  },
  {
    name: 'Anomalous File Access',
    keywords: ['unauthorized', 'file access', 'permission denied', 'sensitive file'],
    severity: 'HIGH',
    description: 'Unusual file access pattern detected',
    mitigation: ['Review access logs', 'Check user activity', 'Isolate affected system'],
    context: 'Indicator of data exfiltration attempt'
  },
  {
    name: 'Suspicious Process Execution',
    keywords: ['process', 'execution', 'malware', 'suspicious'],
    severity: 'HIGH',
    description: 'Unauthorized process started on system',
    mitigation: ['Kill process', 'Scan for malware', 'Isolate system', 'Review logs'],
    context: 'Possible malware or lateral movement'
  }
];

function findRelevantThreats(correlation) {
  const text = JSON.stringify(correlation).toLowerCase();
  const matches = [];

  threatSignatures.forEach(signature => {
    const matchCount = signature.keywords.filter(kw => text.includes(kw)).length;
    if (matchCount > 0) {
      matches.push({
        ...signature,
        relevance_score: matchCount / signature.keywords.length
      });
    }
  });

  return matches.sort((a, b) => b.relevance_score - a.relevance_score);
}

module.exports = { findRelevantThreats, threatSignatures };
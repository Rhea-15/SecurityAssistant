function correlateLogsAdvanced(logs) {
  console.log('\n=== CORRELATION ANALYSIS ===');
  console.log('Total logs received:', logs.length);

  if (logs.length === 0) {
    console.log('⚠ No logs to correlate!');
    console.log('============================\n');
    return {
      total_logs: 0,
      unique_ips: 0,
      patterns: [],
      by_ip: {}
    };
  }

  const correlations = {};
  const timeWindow = 5 * 60 * 1000;

  // Group by source IP
  const byIp = {};
  logs.forEach(log => {
    const ip = log.source_ip;
    console.log(`Processing log: ip=${ip}, action=${log.action}, event_type=${log.event_type}`);
    
    if (ip && ip.trim()) {
      if (!byIp[ip]) byIp[ip] = [];
      byIp[ip].push(log);
    }
  });

  console.log('\nGrouped by IP:');
  Object.entries(byIp).forEach(([ip, ipLogs]) => {
    console.log(`  ${ip}: ${ipLogs.length} logs`);
  });

  const patterns = [];

  Object.entries(byIp).forEach(([ip, ipLogs]) => {
    if (ipLogs.length >= 2) {
      const sortedByTime = ipLogs.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );

      // Brute force detection
      const failedLogins = ipLogs.filter(l => 
        (l.action && l.action.match(/FAILED|REJECT|FAILED_LOGIN/i)) || 
        (l.event_type && l.event_type.match(/AUTH|LOGIN/i))
      );
      
      console.log(`\nIP ${ip}:`);
      console.log(`  - Failed logins: ${failedLogins.length}`);
      console.log(`    Actions: ${failedLogins.map(l => l.action).join(', ')}`);
      
      if (failedLogins.length >= 3) {
        console.log(`  ✓ BRUTE_FORCE DETECTED`);
        patterns.push({
          type: 'BRUTE_FORCE',
          source_ip: ip,
          count: failedLogins.length,
          severity: 'CRITICAL',
          description: `${failedLogins.length} failed login attempts from ${ip}`,
          logs: failedLogins.map(l => l.raw_message || JSON.stringify(l))
        });
      }

      // Port scan detection
      const portScans = ipLogs.filter(l => 
        (l.action && l.action.match(/DROP|BLOCK/i)) && l.port
      );
      
      console.log(`  - Port scans/drops: ${portScans.length}`);
      if (portScans.length > 0) {
        console.log(`    Ports: ${[...new Set(portScans.map(p => p.port))].join(', ')}`);
      }
      
      if (portScans.length >= 10) {
        console.log(`  ✓ PORT_SCAN DETECTED`);
        patterns.push({
          type: 'PORT_SCAN',
          source_ip: ip,
          count: portScans.length,
          severity: 'MEDIUM',
          description: `Port scanning activity detected from ${ip}`,
          ports: [...new Set(portScans.map(p => p.port))],
          logs: portScans.map(l => l.raw_message || JSON.stringify(l))
        });
      }

      // Reconnaissance sequence
      if (portScans.length >= 5 && failedLogins.length >= 2) {
        const firstScan = new Date(sortedByTime[0].timestamp);
        const firstFail = new Date(failedLogins[0].timestamp);
        
        if (firstFail - firstScan < timeWindow) {
          console.log(`  ✓ RECONNAISSANCE_SEQUENCE DETECTED`);
          patterns.push({
            type: 'RECONNAISSANCE_SEQUENCE',
            source_ip: ip,
            severity: 'CRITICAL',
            description: 'Reconnaissance followed by credential attack pattern detected',
            sequence: [
              { step: 1, type: 'SCAN', count: portScans.length },
              { step: 2, type: 'AUTH_ATTACK', count: failedLogins.length }
            ],
            timespan_minutes: Math.round((firstFail - firstScan) / 1000 / 60)
          });
        }
      }
    }
  });

  console.log('\n=== RESULTS ===');
  console.log('Total unique IPs:', Object.keys(byIp).length);
  console.log('Total patterns detected:', patterns.length);
  patterns.forEach(p => {
    console.log(`  - ${p.type} (${p.severity}): ${p.description}`);
  });
  console.log('===============\n');

  return {
    total_logs: logs.length,
    unique_ips: Object.keys(byIp).length,
    patterns,
    by_ip: byIp
  };
}

module.exports = { correlateLogsAdvanced };
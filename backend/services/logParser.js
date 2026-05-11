function detectLogFormat(logText) {
  const trimmedText = logText.trim();
  
  console.log('\n=== FORMAT DETECTION ===');
  console.log('First 100 chars:', trimmedText.substring(0, 100));
  console.log('Starts with [:', trimmedText.startsWith('['));
  console.log('Starts with {:', trimmedText.startsWith('{'));

  // **PRIORITY 1: Try JSON first** (most common for this system)
  if (trimmedText.startsWith('[') || trimmedText.startsWith('{')) {
    try {
      JSON.parse(trimmedText);
      console.log('✓ FORMAT: JSON (valid)');
      console.log('====================\n');
      return 'json';
    } catch (e) {
      console.log('✗ Not valid JSON:', e.message.substring(0, 50));
      // Don't return yet, try other formats
    }
  }

  // **PRIORITY 2: Check for SYSLOG patterns**
  const syslogPatterns = [
    /^\w+\s+\d+\s+\d{2}:\d{2}:\d{2}/,  // "May 4 14:05:00"
    /kernel:|sshd\[|apache|nginx/,      // Common syslog programs
    /\[\d+\]/                            // Process IDs in brackets
  ];
  
  if (syslogPatterns.some(pattern => pattern.test(trimmedText.split('\n')[0]))) {
    console.log('✓ FORMAT: SYSLOG (pattern matched)');
    console.log('====================\n');
    return 'syslog';
  }

  // **PRIORITY 3: Check for CSV**
  const firstLine = trimmedText.split('\n')[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  
  if (commaCount >= 2 && !firstLine.includes('{') && !firstLine.includes('[')) {
    console.log('✓ FORMAT: CSV (comma-separated values)');
    console.log('====================\n');
    return 'csv';
  }

  // **FALLBACK: Default to JSON and let parser handle it**
  console.log('⚠ FORMAT: Unknown, defaulting to JSON');
  console.log('====================\n');
  return 'json';
}

function parseSyslog(line) {
  const regex = /(\w+\s+\d+\s+[\d:]+)\s+(\S+)\s+(\S+):\s*(.*)/;
  const match = line.match(regex);
  
  if (!match) return null;
  
  const [, timestamp, host, source, message] = match;
  const actionMatch = message.match(/(ACCEPT|DROP|REJECT|BLOCK|ALERT)/);
  const ipMatch = message.match(/(\d+\.\d+\.\d+\.\d+)/g);
  const portMatch = message.match(/:(\d+)/);

  return {
    timestamp: new Date(timestamp).toISOString(),
    host,
    source,
    action: actionMatch ? actionMatch[1] : 'UNKNOWN',
    source_ip: ipMatch ? ipMatch[0] : null,
    dest_ip: ipMatch ? ipMatch[1] : null,
    port: portMatch ? portMatch[1] : null,
    raw_message: message,
    severity: determineSeverity(message)
  };
}

function parseJson(logObj) {
  if (!logObj || typeof logObj !== 'object') {
    return null;
  }

  // Extract source_ip from multiple possible field names
  let sourceIp = null;
  if (logObj.src_ip) sourceIp = logObj.src_ip;
  else if (logObj.source_ip) sourceIp = logObj.source_ip;
  else if (logObj.sourceIP) sourceIp = logObj.sourceIP;
  else if (logObj.remote_ip) sourceIp = logObj.remote_ip;
  else if (logObj.ip) sourceIp = logObj.ip;

  // Extract action/event
  let action = null;
  if (logObj.action) action = logObj.action;
  else if (logObj.event) action = logObj.event;
  else if (logObj.alert_type) action = logObj.alert_type;

  // Extract event type
  let eventType = null;
  if (logObj.event_type) eventType = logObj.event_type;
  else if (logObj.type) eventType = logObj.type;
  else if (logObj.source) eventType = logObj.source;

  // For auth logs, ensure we capture FAILED_LOGIN
  if (logObj.event === 'FAILED_LOGIN') {
    action = 'FAILED_LOGIN';
    eventType = 'AUTH';
  }

  const parsed = {
    timestamp: logObj.timestamp || new Date().toISOString(),
    source_ip: sourceIp,
    dest_ip: logObj.dest_ip || logObj.destination_ip || null,
    action: action || 'UNKNOWN',
    event_type: eventType || logObj.source || 'GENERIC',
    port: logObj.port || null,
    severity: logObj.severity || determineSeverity(JSON.stringify(logObj)),
    user: logObj.user || logObj.username || null,
    raw: logObj
  };

  return parsed;
}

function parseCsv(line, headers) {
  const values = line.split(',').map(v => v.trim());
  const obj = {};
  headers.forEach((h, i) => {
    obj[h.toLowerCase()] = values[i];
  });
  
  return {
    timestamp: obj.timestamp || new Date().toISOString(),
    source_ip: obj.source_ip || obj.src_ip || null,
    event_type: obj.event_type || obj.type || 'GENERIC',
    action: obj.action || 'UNKNOWN',
    severity: determineSeverity(line),
    raw: obj
  };
}

function determineSeverity(text) {
  const high = /critical|severity.*high|exploit|breach|malware/i;
  const medium = /warning|alert|suspicious|anomaly/i;
  
  if (high.test(text)) return 'CRITICAL';
  if (medium.test(text)) return 'MEDIUM';
  return 'LOW';
}

function parseLogsFromText(rawText, format) {
  const logs = [];
  
  console.log('\n=== LOG PARSING ===');
  console.log('Format detected:', format);
  console.log('Raw text length:', rawText.length);
  console.log('First 200 chars:', rawText.substring(0, 200));

  if (format === 'json') {
    try {
      const data = JSON.parse(rawText);
      const items = Array.isArray(data) ? data : [data];
      console.log('✓ JSON parsed successfully');
      console.log('Found', items.length, 'log items');
      
      items.forEach((item, idx) => {
        try {
          const parsed = parseJson(item);
          if (parsed) {
            logs.push(parsed);
            if (idx < 3) {
              console.log(`  Log ${idx}: src_ip=${parsed.source_ip}, action=${parsed.action}, event_type=${parsed.event_type}`);
            }
          }
        } catch (e) {
          console.log(`  ✗ Failed to parse log ${idx}:`, e.message);
        }
      });
    } catch (e) {
      console.error('✗ JSON parse error:', e.message);
    }
  } 
  else if (format === 'syslog') {
    const lines = rawText.split('\n').filter(l => l.trim());
    console.log('Found', lines.length, 'lines to parse');
    
    let validCount = 0;
    lines.forEach((line, idx) => {
      const parsed = parseSyslog(line);
      if (parsed) {
        logs.push(parsed);
        validCount++;
        if (validCount <= 3) {
          console.log(`  Log ${idx}: src_ip=${parsed.source_ip}, action=${parsed.action}`);
        }
      }
    });
    console.log(`✓ Parsed ${validCount} valid syslog entries`);
  } 
  else if (format === 'csv') {
    const lines = rawText.split('\n').filter(l => l.trim());
    if (lines.length > 0) {
      const headers = lines[0].split(',').map(h => h.trim());
      console.log('CSV headers:', headers);
      
      for (let i = 1; i < lines.length; i++) {
        const parsed = parseCsv(lines[i], headers);
        if (parsed) {
          logs.push(parsed);
        }
      }
      console.log('✓ Parsed', logs.length, 'CSV entries');
    }
  }

  console.log('\n=== PARSING RESULTS ===');
  console.log('✓ Total logs parsed:', logs.length);
  
  const logsWithIp = logs.filter(l => l.source_ip && l.source_ip.trim());
  console.log('✓ Logs with source_ip:', logsWithIp.length);
  
  if (logsWithIp.length > 0) {
    const uniqueIps = [...new Set(logsWithIp.map(l => l.source_ip))];
    console.log('✓ Unique IPs:', uniqueIps.length);
    console.log('Sample IPs:');
    uniqueIps.slice(0, 3).forEach(ip => {
      const count = logsWithIp.filter(l => l.source_ip === ip).length;
      const actions = [...new Set(logsWithIp.filter(l => l.source_ip === ip).map(l => l.action))];
      console.log(`  - ${ip}: ${count} logs, actions: ${actions.join(', ')}`);
    });
  } else {
    console.log('⚠ WARNING: No logs with valid source_ip found!');
  }
  
  console.log('====================\n');

  return logs;
}

module.exports = {
  detectLogFormat,
  parseLogsFromText
};
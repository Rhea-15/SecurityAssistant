```markdown
security-soc-assistant/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   ├── database.js
│   │   └── chroma.js
│   ├── routes/
│   │   ├── logs.js
│   │   ├── analysis.js
│   │   └── reports.js
│   ├── controllers/
│   │   ├── logController.js
│   │   ├── analysisController.js
│   │   └── reportController.js
│   ├── services/
│   │   ├── logParser.js
│   │   ├── logCorrelator.js
│   │   ├── claudeAnalyzer.js
│   │   ├── ragService.js
│   │   └── patternClusterer.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── constants.js
│   └── database/
│       └── migrations/
│           └── 001_initial_schema.sql
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LogUploader.jsx
│   │   │   ├── AnalysisResults.jsx
│   │   │   ├── IncidentReport.jsx
│   │   │   ├── PatternVisualization.jsx
│   │   │   └── Timeline.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Analysis.jsx
│   │   │   └── Reports.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── utils/
│   │       └── formatters.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── data/
│   ├── sample_logs/
│   │   ├── firewall_logs.json
│   │   ├── ids_alerts.json
│   │   ├── auth_logs.json
│   │   └── endpoint_logs.json
│   └── threat_signatures.json
│
└── docs/
    ├── SETUP.md
    ├── API_ENDPOINTS.md
    └── USER_FLOW.md
```

PROVIDE ME CODE FOR EXACT UI THAT MATCHES THE SCREEN SHORTS. I NEED ALL THE CODE IN CHATS ITSELF NO ARTIFACTS. EXISTING CODE================================================
FILE: backend/package.json
================================================
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Security SOC Assistant Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "axios": "^1.16.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^4.18.2",
    "groq-sdk": "^0.3.3",
    "uuid": "^14.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}



================================================
FILE: backend/server.js
================================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import routes
const logRoutes = require('./routes/logs');
const analysisRoutes = require('./routes/analysis');
const reportRoutes = require('./routes/reports');

// Register routes
app.use('/api', logRoutes);
app.use('/api', analysisRoutes);
app.use('/api', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Security SOC Assistant running on port ${PORT}`);
});


================================================
FILE: backend/config/chroma.js
================================================
// Chroma vector DB configuration
// Placeholder for future vector DB integration

const chromaConfig = {
    host: process.env.CHROMA_HOST || 'localhost',
    port: process.env.CHROMA_PORT || 8000,
    ssl: false
  };
  
  module.exports = chromaConfig;


================================================
FILE: backend/config/database.js
================================================
// Database configuration
// Placeholder for future PostgreSQL integration
// For now, using in-memory storage

const config = {
    development: {
      type: 'sqlite',
      database: ':memory:'
    },
    production: {
      type: 'postgres',
      url: process.env.DATABASE_URL
    }
  };
  
  module.exports = config;


================================================
FILE: backend/controllers/analysisController.js
================================================
// Analysis controller - handles analysis logic
// Currently handled in routes/analysis.js
// Placeholder for future expansion

const analysisController = {
    correlate: async (req, res) => {
      // Logic here
    },
    
    analyze: async (req, res) => {
      // Logic here
    }
  };
  
  module.exports = analysisController;


================================================
FILE: backend/controllers/logController.js
================================================
// Log controller - handles log-related logic
// Currently handled in routes/logs.js
// Placeholder for future expansion

const logController = {
    uploadLogs: async (req, res) => {
      // Logic here
    },
    
    getLogs: async (req, res) => {
      // Logic here
    }
  };
  
  module.exports = logController;


================================================
FILE: backend/controllers/reportController.js
================================================
// Report controller - handles report generation
// Currently handled in routes/reports.js
// Placeholder for future expansion

const reportController = {
    generateReport: async (req, res) => {
      // Logic here
    }
  };
  
  module.exports = reportController;


================================================
FILE: backend/database/migrations/001_initial_schema.sql
================================================
-- Initial database schema
-- For future PostgreSQL integration

CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50),
  timestamp TIMESTAMP NOT NULL,
  raw_data JSONB,
  parsed_data JSONB,
  severity VARCHAR(20),
  source_ip INET,
  event_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_timestamp ON logs(timestamp);
CREATE INDEX idx_logs_source_ip ON logs(source_ip);
CREATE INDEX idx_logs_event_type ON logs(event_type);

CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  description TEXT,
  severity VARCHAR(20),
  status VARCHAR(20) DEFAULT 'open',
  first_seen TIMESTAMP,
  last_seen TIMESTAMP,
  related_logs JSONB,
  analysis_result JSONB,
  mitigation_steps JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_incidents_status ON incidents(status);

CREATE TABLE attack_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  pattern_signature JSONB,
  severity VARCHAR(20),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id),
  title VARCHAR(255),
  content TEXT,
  format VARCHAR(20),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);


================================================
FILE: backend/routes/analysis.js
================================================
const express = require('express');
const { correlateLogsAdvanced } = require('../services/logCorrelator');
const { findRelevantThreats } = require('../services/ragService');
const { analyzeWithClaude } = require('../services/claudeAnalyzer');
const { clusterAttackPatterns } = require('../services/patternClusterer');

const router = express.Router();

// Correlate logs
router.post('/analysis/correlate', (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = global.sessions[sessionId];

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const correlation = correlateLogsAdvanced(session.logs);
    session.correlation = correlation;

    res.json(correlation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze with Claude
router.post('/analysis/claude', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = global.sessions[sessionId];

    if (!session || !session.correlation) {
      return res.status(400).json({ error: 'No correlation data found. Run correlation first.' });
    }

    const relevantThreats = findRelevantThreats(session.correlation);
    const analysis = await analyzeWithClaude(session.correlation, relevantThreats);

    session.analysis = analysis;

    res.json({
      analysis,
      relevant_threats: relevantThreats.slice(0, 3),
      incident_id: require('uuid').v4()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pattern clusters
router.post('/patterns/cluster', (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = global.sessions[sessionId];

    if (!session || !session.correlation) {
      return res.status(400).json({ error: 'No correlation data found' });
    }

    const clusters = clusterAttackPatterns(session.correlation.patterns);

    res.json({
      total_clusters: clusters.length,
      total_incidents: session.correlation.patterns.length,
      clusters
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


================================================
FILE: backend/routes/logs.js
================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { detectLogFormat, parseLogsFromText } = require('../services/logParser');

const router = express.Router();

// Global session storage
global.sessions = global.sessions || {};

// Upload and parse logs
router.post('/logs/upload', (req, res) => {
  try {
    const { content, filename } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'No log content provided' });
    }

    const format = detectLogFormat(content);
    const parsed = parseLogsFromText(content, format);

    const sessionId = uuidv4();
    global.sessions[sessionId] = {
      logs: parsed,
      filename,
      format,
      upload_time: new Date(),
      correlation: null,
      analysis: null
    };

    res.json({
      sessionId,
      parsed_count: parsed.length,
      format,
      sample: parsed.slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get uploaded logs
router.get('/logs/:sessionId', (req, res) => {
  try {
    const session = global.sessions[req.params.sessionId];
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ logs: session.logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


================================================
FILE: backend/routes/reports.js
================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Generate incident report
router.post('/reports/generate', (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = global.sessions[sessionId];

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const report = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      logs_analyzed: session.logs.length,
      source_file: session.filename,
      correlation: session.correlation,
      analysis: session.analysis,
      timestamp_generated: new Date().toISOString()
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all incidents
router.get('/incidents', (req, res) => {
  try {
    res.json({
      incidents: [],
      total: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


================================================
FILE: backend/services/claudeAnalyzer.js
================================================
const Groq = require('groq-sdk');

let groqClient = null;

function initializeClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not found in environment variables');
    }
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groqClient;
}

// Function to extract JSON from text
function extractJSON(text) {
  try {
    // Try direct JSON parse first
    return JSON.parse(text);
  } catch (e) {
    // If that fails, try to find JSON object in text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        // If still fails, try to clean and parse
        let cleaned = jsonMatch[0]
          .replace(/[\n\r]/g, ' ')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');
        return JSON.parse(cleaned);
      }
    }
    return null;
  }
}

// Function to create structured response from text
function createStructuredResponse(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  return {
    summary: lines.slice(0, 2).join(' ').substring(0, 200),
    threat_assessment: lines.slice(2, 4).join(' ') || 'Threat detected',
    mitigation_steps: [
      'Block source IP at firewall',
      'Review authentication logs',
      'Enable additional monitoring',
      'Check for unauthorized access'
    ],
    explanation: text.substring(0, 300),
    recommended_severity: text.toLowerCase().includes('critical') ? 'CRITICAL' : 
                         text.toLowerCase().includes('high') ? 'HIGH' :
                         text.toLowerCase().includes('medium') ? 'MEDIUM' : 'LOW'
  };
}

async function analyzeWithClaude(correlationData, relevantThreats) {
  try {
    const groq = initializeClient();

    const threatContext = relevantThreats
      .slice(0, 3)
      .map(t => `- ${t.name}: ${t.description}`)
      .join('\n');

    // Simplified prompt for better JSON responses
    const prompt = `Analyze this security incident. Return ONLY valid JSON, nothing else.

Incident Data:
${JSON.stringify(correlationData, null, 2)}

Threat Types:
${threatContext}

Return this exact JSON format:
{
  "summary": "Brief 1-2 sentence summary of what happened",
  "threat_assessment": "What type of threat this is and why",
  "mitigation_steps": ["Step 1", "Step 2", "Step 3"],
  "explanation": "Clear explanation for non-technical people",
  "recommended_severity": "CRITICAL or HIGH or MEDIUM or LOW"
}`;

    console.log('Sending request to Groq...');

    const message = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      temperature: 0.2 // Lower temperature for more consistent JSON
    });

    const content = message.choices[0].message.content;
    console.log('Raw response:', content.substring(0, 100) + '...');

    // Try to extract and parse JSON
    const parsed = extractJSON(content);
    
    if (parsed && parsed.summary) {
      console.log('Successfully parsed JSON response');
      return parsed;
    }

    // If JSON extraction failed, create structured response
    console.log('Could not extract JSON, creating structured response');
    return createStructuredResponse(content);

  } catch (error) {
    console.error('Groq API error:', error.message);

    // Return a default response on error
    return {
      summary: 'Security incident detected',
      threat_assessment: 'Multiple threat indicators identified',
      mitigation_steps: [
        'Block suspicious IP addresses',
        'Review authentication logs',
        'Enable real-time monitoring',
        'Check for data exfiltration'
      ],
      explanation: `Incident analysis service error: ${error.message}. Please review logs manually.`,
      recommended_severity: 'MEDIUM'
    };
  }
}

module.exports = { analyzeWithClaude };


================================================
FILE: backend/services/logCorrelator.js
================================================
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


================================================
FILE: backend/services/logParser.js
================================================
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


================================================
FILE: backend/services/patternClusterer.js
================================================
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


================================================
FILE: backend/services/ragService.js
================================================
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


================================================
FILE: backend/utils/constants.js
================================================
// Constants
const SEVERITY_LEVELS = {
    CRITICAL: 'CRITICAL',
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW'
  };
  
  const ATTACK_TYPES = {
    BRUTE_FORCE: 'BRUTE_FORCE',
    PORT_SCAN: 'PORT_SCAN',
    DDOS: 'DDOS',
    PRIVILEGE_ESCALATION: 'PRIVILEGE_ESCALATION',
    DATA_EXFILTRATION: 'DATA_EXFILTRATION'
  };
  
  const LOG_FORMATS = {
    JSON: 'json',
    CSV: 'csv',
    SYSLOG: 'syslog'
  };
  
  module.exports = {
    SEVERITY_LEVELS,
    ATTACK_TYPES,
    LOG_FORMATS
  };


================================================
FILE: backend/utils/logger.js
================================================
// Simple logger utility
const logger = {
    info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
    error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
    debug: (msg) => console.log(`[DEBUG] ${new Date().toISOString()} - ${msg}`)
  };
  
  module.exports = logger;


================================================
FILE: docs/API_ENDPOINTS.md
================================================
[Empty file]


================================================
FILE: docs/SETUP.md
================================================
[Empty file]


================================================
FILE: docs/USER_FLOW.md
================================================
[Empty file]


================================================
FILE: frontend/README.md
================================================
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



================================================
FILE: frontend/eslint.config.js
================================================
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])



================================================
FILE: frontend/index.html
================================================
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SecOps Assistant</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>


================================================
FILE: frontend/package.json
================================================
{
  "name": "frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.16.0",
    "react": "^19.2.5",
    "react-dom": "^19.2.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "vite": "^8.0.10",
    "tailwindcss": "^4.2.4",
    "autoprefixer": "^10.5.0",
    "postcss": "^8.5.13"
  }
}


================================================
FILE: frontend/postcss.config.js
================================================
[Empty file]


================================================
FILE: frontend/tailwind.config.js
================================================
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}


================================================
FILE: frontend/vite.config.js
================================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})


================================================
FILE: frontend/src/App.css
================================================
/* ── Layout ── */
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ── Scanline grid overlay (subtle) ── */
.app::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.015) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

/* ── Shared card base ── */
.panel {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: border-color var(--transition);
}
.panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-cyan), transparent);
  opacity: 0.4;
}
.panel:hover { border-color: var(--border-strong); }

/* ── Section labels ── */
.section-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-cyan);
  opacity: 0.7;
}

/* ── Severity chips ── */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.chip-critical { background: var(--accent-red-dim); color: var(--accent-red); border: 1px solid rgba(255,61,90,0.25); }
.chip-high     { background: var(--accent-orange-dim); color: var(--accent-orange); border: 1px solid rgba(255,140,66,0.25); }
.chip-medium   { background: var(--accent-yellow-dim, rgba(255,209,102,0.1)); color: var(--accent-yellow); border: 1px solid rgba(255,209,102,0.25); }
.chip-low      { background: var(--accent-green-dim); color: var(--accent-green); border: 1px solid rgba(0,255,136,0.2); }

/* ── Pulse dot ── */
.pulse-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--accent-green);
  box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4);
  animation: pulse-ring 2s ease-out infinite;
  flex-shrink: 0;
}
@keyframes pulse-ring {
  0%   { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4); }
  70%  { box-shadow: 0 0 0 8px rgba(0, 255, 136, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
}
.pulse-dot.red { background: var(--accent-red); animation-name: pulse-ring-red; }
@keyframes pulse-ring-red {
  0%   { box-shadow: 0 0 0 0 rgba(255, 61, 90, 0.4); }
  70%  { box-shadow: 0 0 0 8px rgba(255, 61, 90, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 61, 90, 0); }
}

/* ── Alerts ── */
.alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  border-left: 3px solid;
}
.alert-error   { background: var(--accent-red-dim); border-color: var(--accent-red); color: #ffaab5; }
.alert-success { background: var(--accent-green-dim); border-color: var(--accent-green); color: #7fffc4; }
.alert-info    { background: var(--accent-cyan-dim); border-color: var(--accent-cyan); color: var(--accent-cyan); }

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all var(--transition);
  text-transform: uppercase;
}
.btn-primary {
  background: var(--accent-cyan);
  color: var(--bg-void);
}
.btn-primary:hover { background: #33ddff; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
}
.btn-ghost:hover { border-color: var(--border-strong); color: var(--text-primary); background: var(--bg-elevated); }

/* ── Loading bar ── */
.loading-bar {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-cyan), var(--accent-green), var(--accent-cyan), transparent);
  background-size: 200% 100%;
  animation: scan 1.5s linear infinite;
  border-radius: 1px;
}
@keyframes scan {
  0%   { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

/* ── Loading container ── */
.loading-container {
  padding: 32px;
  text-align: center;
}
.loading-label {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent-cyan);
  letter-spacing: 0.04em;
  animation: blink 1.2s step-end infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Stat number ── */
.stat-num {
  font-family: var(--font-mono);
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

/* ── Divider ── */
.divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 20px 0;
}

/* ── Scrollable log list ── */
.log-scroll {
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

/* ── IP tag ── */
.ip-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  background: var(--accent-cyan-dim);
  color: var(--accent-cyan);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
}

/* ── Terminal text ── */
.terminal {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent-green);
  background: rgba(0,0,0,0.4);
  border-radius: var(--radius-md);
  padding: 16px;
  line-height: 1.8;
  border: 1px solid rgba(0,255,136,0.1);
}
.terminal .t-dim { color: var(--text-muted); }
.terminal .t-cyan { color: var(--accent-cyan); }
.terminal .t-red { color: var(--accent-red); }
.terminal .t-yellow { color: var(--accent-yellow); }

/* ── Animated fade-in ── */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fadeSlideUp 0.4s ease both; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .app { padding: 16px 12px 60px; gap: 20px; }
}


================================================
FILE: frontend/src/App.jsx
================================================
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './components/Dashboard';
import LogUploader from './components/LogUploader';
import Timeline from './components/Timeline';
import CorrelationView from './components/CorrelationView';
import AnalysisResults from './components/AnalysisResults';
import PatternClusters from './components/PatternVisualization';
import IncidentReport from './components/IncidentReport';

const API_URL = 'http://localhost:5000/api';

const STEP_LABELS = {
  upload:      null,
  correlating: '⟳ Correlating log patterns...',
  analyzing:   '⟳ AI threat analysis running (30–60s)...',
  clustering:  '⟳ Clustering attack patterns...',
  reporting:   '⟳ Generating incident report...',
};

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [correlation, setCorrelation] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [clusters, setClusters] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState('upload');

  const handleUpload = (data) => {
    setSessionId(data.sessionId);
    setLogs(data.sample);
    setError('');
    setCurrentStep('correlating');
    setTimeout(() => runCorrelation(data.sessionId), 400);
  };

  const runCorrelation = async (id) => {
    setLoading(true);
    try {
      const r = await axios.post(`${API_URL}/analysis/correlate`, { sessionId: id });
      setCorrelation(r.data);
      setCurrentStep('analyzing');
      setTimeout(() => runAnalysis(id), 400);
    } catch (e) {
      setError('Correlation failed: ' + e.message);
    } finally { setLoading(false); }
  };

  const runAnalysis = async (id) => {
    setLoading(true);
    try {
      const r = await axios.post(`${API_URL}/analysis/claude`, { sessionId: id });
      setAnalysis(r.data.analysis);
      setCurrentStep('clustering');
      setTimeout(() => runClustering(id), 400);
    } catch (e) {
      setError('Analysis failed: ' + (e.response?.data?.error || e.message));
      setTimeout(() => runClustering(id), 800);
    } finally { setLoading(false); }
  };

  const runClustering = async (id) => {
    setLoading(true);
    try {
      const r = await axios.post(`${API_URL}/patterns/cluster`, { sessionId: id });
      setClusters(r.data.clusters);
      setCurrentStep('reporting');
      setTimeout(() => generateReport(id), 400);
    } catch (e) {
      setError('Clustering failed: ' + e.message);
      setTimeout(() => generateReport(id), 800);
    } finally { setLoading(false); }
  };

  const generateReport = async (id) => {
    setLoading(true);
    try {
      const r = await axios.post(`${API_URL}/reports/generate`, { sessionId: id });
      setReport(r.data);
      setCurrentStep('complete');
    } catch (e) {
      setError('Report failed: ' + e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="app">
      <Dashboard stats={{
        incidents: correlation ? correlation.patterns.length : 0,
        threats:   clusters ? clusters.length : 0,
        high_severity: clusters ? clusters.filter(c => c.severity === 'CRITICAL').length : 0,
      }} />

      {error && (
        <div className="alert alert-error">
          ⚠ {error}
        </div>
      )}

      {currentStep === 'upload' && <LogUploader onUpload={handleUpload} />}

      {sessionId && (
        <>
          {loading && (
            <div className="panel" style={{ padding: '24px 32px' }}>
              <div className="loading-bar" style={{ marginBottom: 14 }} />
              <div className="loading-label">{STEP_LABELS[currentStep]}</div>
            </div>
          )}

          {logs.length > 0 && <Timeline logs={logs} />}
          {correlation && !loading && <CorrelationView correlation={correlation} />}
          {analysis   && !loading && <AnalysisResults analysis={analysis} />}
          {clusters   && !loading && <PatternClusters clusters={clusters} />}
          {report     && !loading && <IncidentReport report={report} analysis={analysis} />}
        </>
      )}
    </div>
  );
}

export default App;


================================================
FILE: frontend/src/index.css
================================================
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --bg-void: #050810;
  --bg-deep: #080d1a;
  --bg-surface: #0d1426;
  --bg-elevated: #111d35;
  --bg-glass: rgba(13, 20, 38, 0.85);
  --bg-glass-hover: rgba(17, 29, 53, 0.9);

  --accent-cyan: #00d4ff;
  --accent-cyan-dim: rgba(0, 212, 255, 0.12);
  --accent-cyan-glow: rgba(0, 212, 255, 0.25);
  --accent-green: #00ff88;
  --accent-green-dim: rgba(0, 255, 136, 0.1);
  --accent-red: #ff3d5a;
  --accent-red-dim: rgba(255, 61, 90, 0.12);
  --accent-orange: #ff8c42;
  --accent-orange-dim: rgba(255, 140, 66, 0.12);
  --accent-yellow: #ffd166;
  --accent-purple: #9b5de5;
  --accent-purple-dim: rgba(155, 93, 229, 0.12);

  --border-subtle: rgba(0, 212, 255, 0.08);
  --border-default: rgba(0, 212, 255, 0.15);
  --border-strong: rgba(0, 212, 255, 0.3);

  --text-primary: #e8edf5;
  --text-secondary: #8896b0;
  --text-muted: #4a5568;
  --text-code: #00d4ff;

  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-sans: 'Inter', -apple-system, sans-serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --transition: 0.2s ease;
  --transition-slow: 0.4s ease;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  background: var(--bg-void);
  color: var(--text-primary);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0, 212, 255, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 80%, rgba(155, 93, 229, 0.04) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

#root { position: relative; z-index: 1; width: 100%; min-height: 100vh; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-deep); }
::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }

h1, h2, h3, h4 { font-family: var(--font-mono); letter-spacing: -0.02em; }
p { line-height: 1.6; }
code { font-family: var(--font-mono); color: var(--text-code); font-size: 0.875em; }


================================================
FILE: frontend/src/main.jsx
================================================
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


================================================
FILE: frontend/src/components/AnalysisResults.jsx
================================================
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


================================================
FILE: frontend/src/components/CorrelationView.jsx
================================================
import React from 'react';

const chipClass = (sev = '') => {
  const s = sev.toUpperCase();
  if (s === 'CRITICAL') return 'chip chip-critical';
  if (s === 'HIGH')     return 'chip chip-high';
  if (s === 'MEDIUM')   return 'chip chip-medium';
  return 'chip chip-low';
};

const typeIcon = (type = '') => {
  if (type.includes('BRUTE'))  return '⚡';
  if (type.includes('PORT'))   return '◎';
  if (type.includes('RECON'))  return '⬡';
  if (type.includes('DDOS'))   return '⬢';
  return '◈';
};

function CorrelationView({ correlation }) {
  if (!correlation) return null;

  const statItems = [
    { label: 'Logs Analyzed', value: correlation.total_logs || 0 },
    { label: 'Unique IPs', value: correlation.unique_ips || 0 },
    { label: 'Patterns Found', value: correlation.patterns?.length || 0 },
  ];

  return (
    <div className="panel fade-in" style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <div className="section-tag" style={{ marginBottom: 6 }}>Correlation Engine</div>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Log Correlation Analysis</h2>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {statItems.map((s, i) => (
          <div key={i} style={{
            padding: '16px 20px',
            background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>
              {String(s.value).padStart(2, '0')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Patterns */}
      {correlation.patterns?.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 4, textTransform: 'uppercase' }}>
            Detected Threats
          </div>
          {correlation.patterns.map((p, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '16px 20px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: p.severity === 'CRITICAL' ? 'rgba(255,61,90,0.05)' :
                          p.severity === 'HIGH'     ? 'rgba(255,140,66,0.05)' :
                          p.severity === 'MEDIUM'   ? 'rgba(255,209,102,0.05)' : 'rgba(0,255,136,0.03)',
              animation: `fadeSlideUp 0.35s ease ${i * 0.06}s both`,
            }}>
              <div style={{ fontSize: 24, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>
                {typeIcon(p.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                    {p.type}
                  </span>
                  <span className={chipClass(p.severity)}>{p.severity}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {p.description}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {p.count && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                      COUNT: {p.count}
                    </span>
                  )}
                  {p.source_ip && <span className="ip-tag">{p.source_ip}</span>}
                  {p.ports && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                      PORTS: {p.ports.slice(0, 5).join(', ')}{p.ports.length > 5 ? '…' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '24px', textAlign: 'center',
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
          background: 'var(--accent-green-dim)',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
          <p style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            No suspicious patterns detected
          </p>
        </div>
      )}
    </div>
  );
}

export default CorrelationView;


================================================
FILE: frontend/src/components/Dashboard.jsx
================================================
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


================================================
FILE: frontend/src/components/IncidentReport.jsx
================================================
import React from 'react';

function IncidentReport({ report, analysis }) {
  if (!report) return null;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soc-report-${report.id.substring(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const meta = [
    { label: 'Report ID', value: report.id.substring(0, 16) + '…' },
    { label: 'Generated', value: new Date(report.timestamp_generated).toLocaleString() },
    { label: 'Logs Analyzed', value: report.logs_analyzed },
    { label: 'Source', value: report.source_file || 'N/A' },
  ];

  return (
    <div className="panel fade-in" style={{ padding: '28px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="section-tag" style={{ marginBottom: 6 }}>Report</div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Incident Report</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="pulse-dot" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-green)', letterSpacing: '0.08em' }}>
            COMPLETE
          </span>
        </div>
      </div>

      {/* Metadata table */}
      <div className="terminal" style={{ marginBottom: 24 }}>
        {meta.map(m => (
          <div key={m.label} style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
            <span className="t-dim" style={{ minWidth: 130, fontSize: 11 }}>{m.label.toUpperCase()}:</span>
            <span className="t-cyan">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Analysis sections */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Summary', val: analysis.summary, border: 'var(--accent-cyan)' },
            { label: 'Threat Assessment', val: analysis.threat_assessment, border: 'var(--accent-red)' },
          ].map(sec => (
            <div key={sec.label}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                ▸ {sec.label}
              </div>
              <p style={{
                padding: '14px 16px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
                background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)', borderLeft: `3px solid ${sec.border}`,
              }}>
                {sec.val}
              </p>
            </div>
          ))}

          {/* Actions */}
          {analysis.mitigation_steps?.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                ▸ Recommended Actions
              </div>
              <div className="terminal">
                {(Array.isArray(analysis.mitigation_steps) ? analysis.mitigation_steps : [analysis.mitigation_steps]).map((s, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <span className="t-cyan">[{String(i + 1).padStart(2, '0')}]</span>{' '}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
        <button className="btn btn-primary" onClick={handleExport}>
          ↓ Download Report
        </button>
        <button className="btn btn-ghost" onClick={() => window.print()}>
          ⎙ Print
        </button>
      </div>
    </div>
  );
}

export default IncidentReport;


================================================
FILE: frontend/src/components/LogUploader.jsx
================================================
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
      setFile(null);
      onUpload(resp.data);
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
          Drop your log files for automated threat correlation and AI-powered analysis
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


================================================
FILE: frontend/src/components/PatternVisualization.jsx
================================================
import React from 'react';

const SEV_CONFIG = {
  CRITICAL: { color: 'var(--accent-red)',    dim: 'rgba(255,61,90,0.07)',   bar: '#ff3d5a' },
  HIGH:     { color: 'var(--accent-orange)', dim: 'rgba(255,140,66,0.07)', bar: '#ff8c42' },
  MEDIUM:   { color: 'var(--accent-yellow)', dim: 'rgba(255,209,102,0.07)', bar: '#ffd166' },
  LOW:      { color: 'var(--accent-green)',  dim: 'rgba(0,255,136,0.07)',  bar: '#00ff88' },
};

function PatternClusters({ clusters }) {
  if (!clusters || clusters.length === 0) return null;

  return (
    <div className="panel fade-in" style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <div className="section-tag" style={{ marginBottom: 6 }}>Pattern Engine</div>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Attack Pattern Clusters</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {clusters.map((cluster, i) => {
          const cfg = SEV_CONFIG[cluster.severity] || SEV_CONFIG.LOW;
          return (
            <div key={i} style={{
              padding: '20px',
              background: cfg.dim,
              borderRadius: 'var(--radius-lg)',
              border: `1px solid ${cfg.color}30`,
              animation: `fadeSlideUp 0.35s ease ${i * 0.07}s both`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Top accent bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: cfg.color, opacity: 0.6,
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                  color: cfg.color, letterSpacing: '0.04em',
                }}>
                  {cluster.type}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700,
                  color: cfg.color, lineHeight: 1,
                }}>
                  {cluster.count}
                </div>
              </div>

              {/* Severity bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                    SEVERITY
                  </span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: cfg.color }}>
                    {cluster.severity}
                  </span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    background: cfg.color,
                    width: cluster.severity === 'CRITICAL' ? '100%' :
                           cluster.severity === 'HIGH'     ? '75%' :
                           cluster.severity === 'MEDIUM'   ? '50%' : '25%',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>

              {/* Instances */}
              {cluster.instances?.length > 0 && (
                <div>
                  {cluster.instances.slice(0, 3).map((inst, j) => (
                    <div key={j} style={{
                      fontSize: 12, color: 'var(--text-secondary)',
                      padding: '5px 0', borderBottom: j < 2 && j < cluster.instances.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      display: 'flex', gap: 8, alignItems: 'flex-start',
                    }}>
                      <span style={{ color: cfg.color, flexShrink: 0, marginTop: 1 }}>›</span>
                      <span>{inst.description}</span>
                    </div>
                  ))}
                  {cluster.instances.length > 3 && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                      +{cluster.instances.length - 3} more instances
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PatternClusters;


================================================
FILE: frontend/src/components/Timeline.jsx
================================================
import React, { useState } from 'react';

const actionColor = (action = '') => {
  const a = action.toUpperCase();
  if (a.match(/FAIL|REJECT|DROP|BLOCK|DENIED/)) return 'var(--accent-red)';
  if (a.match(/ALERT|WARN|SUSPICIOUS/)) return 'var(--accent-orange)';
  if (a.match(/ACCEPT|ALLOW|SUCCESS/)) return 'var(--accent-green)';
  return 'var(--accent-cyan)';
};

function Timeline({ logs }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const visible = expanded ? sorted : sorted.slice(0, 6);

  return (
    <div className="panel fade-in" style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div className="section-tag" style={{ marginBottom: 6 }}>Event Stream</div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Activity Timeline</h2>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
          padding: '4px 10px', background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
        }}>
          {sorted.length} events
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: 28 }}>
        {/* Track line */}
        <div style={{
          position: 'absolute', left: 7, top: 8, bottom: 8,
          width: 1, background: 'linear-gradient(to bottom, var(--accent-cyan), var(--accent-purple), transparent)',
          opacity: 0.3,
        }} />

        {visible.map((log, i) => {
          const color = actionColor(log.action);
          return (
            <div key={i} style={{
              display: 'flex', gap: 16, marginBottom: 14, position: 'relative',
              animation: `fadeSlideUp 0.3s ease ${i * 0.04}s both`,
            }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', left: -22, top: 6,
                width: 10, height: 10, borderRadius: '50%',
                background: color, border: `2px solid var(--bg-surface)`,
                boxShadow: `0 0 8px ${color}60`,
                flexShrink: 0,
              }} />

              {/* Content */}
              <div style={{
                flex: 1, padding: '10px 14px',
                background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 8,
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                    color, letterSpacing: '0.04em',
                  }}>
                    {log.action || 'UNKNOWN'}
                  </span>
                  {log.source_ip && <span className="ip-tag">{log.source_ip}</span>}
                  {log.event_type && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      [{log.event_type}]
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length > 6 && (
        <button
          className="btn btn-ghost"
          onClick={() => setExpanded(e => !e)}
          style={{ marginTop: 8, width: '100%', justifyContent: 'center', fontSize: 11 }}
        >
          {expanded ? '▲ Show less' : `▼ Show ${sorted.length - 6} more events`}
        </button>
      )}
    </div>
  );
}

export default Timeline;


================================================
FILE: frontend/src/pages/Analysis.jsx
================================================
import React from 'react';
import CorrelationView from '../components/CorrelationView';
import AnalysisResults from '../components/AnalysisResults';

function Analysis({ correlation, analysis }) {
  return (
    <div className="analysis-page">
      {correlation && <CorrelationView correlation={correlation} />}
      {analysis && <AnalysisResults analysis={analysis} />}
    </div>
  );
}

export default Analysis;


================================================
FILE: frontend/src/pages/Home.jsx
================================================
import React from 'react';

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to Security SOC Assistant</h1>
      <p>Upload your security logs and get instant analysis</p>
    </div>
  );
}

export default Home;


================================================
FILE: frontend/src/pages/Reports.jsx
================================================
import React from 'react';
import IncidentReport from '../components/IncidentReport';

function Reports({ report, analysis }) {
  return (
    <div className="reports-page">
      {report && <IncidentReport report={report} analysis={analysis} />}
    </div>
  );
}

export default Reports;


================================================
FILE: frontend/src/pages/Upload.jsx
================================================
import React from 'react';
import LogUploader from '../components/LogUploader';

function Upload({ onUpload }) {
  return (
    <div className="upload-page">
      <LogUploader onUpload={onUpload} />
    </div>
  );
}

export default Upload;


================================================
FILE: frontend/src/services/api.js
================================================
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  uploadLogs: (content, filename) => {
    return axios.post(`${API_URL}/logs/upload`, { content, filename });
  },

  getLogs: (sessionId) => {
    return axios.get(`${API_URL}/logs/${sessionId}`);
  },

  correlate: (sessionId) => {
    return axios.post(`${API_URL}/analysis/correlate`, { sessionId });
  },

  analyze: (sessionId) => {
    return axios.post(`${API_URL}/analysis/claude`, { sessionId });
  },

  cluster: (sessionId) => {
    return axios.post(`${API_URL}/patterns/cluster`, { sessionId });
  },

  generateReport: (sessionId) => {
    return axios.post(`${API_URL}/reports/generate`, { sessionId });
  },

  health: () => {
    return axios.get(`${API_URL}/health`);
  }
};

export default api;


================================================
FILE: frontend/src/styles/globals.css
================================================
:root {
    --primary: #60a5fa;
    --secondary: #34d399;
    --danger: #dc2626;
    --warning: #eab308;
    --bg-dark: #0f172a;
    --bg-light: #1e293b;
    --text: #f1f5f9;
    --text-muted: #cbd5e1;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
  
  * {
    box-sizing: border-box;
  }


================================================
FILE: frontend/src/utils/formatters.js
================================================
function getSeverityColor(severity) {
  const colors = {
    'CRITICAL': '#dc2626',
    'HIGH': '#ea580c',
    'MEDIUM': '#eab308',
    'LOW': '#16a34a'
  };
  return colors[severity] || '#6b7280';
}

function copyToClipboard(text) {
  if (Array.isArray(text)) {
    text = text.join('\n');
  }
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
}

export { getSeverityColor, copyToClipboard };
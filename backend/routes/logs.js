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
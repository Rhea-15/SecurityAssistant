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
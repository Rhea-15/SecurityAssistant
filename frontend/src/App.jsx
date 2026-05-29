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
import HistoryPanel, { saveToHistory } from './components/HistoryPanel';
import HistoryDetail from './components/HistoryDetail';

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
  const [historyEntry, setHistoryEntry] = useState(null);

  const resetAll = () => {
    setSessionId(null);
    setLogs([]);
    setCorrelation(null);
    setAnalysis(null);
    setClusters(null);
    setReport(null);
    setError('');
    setCurrentStep('upload');
  };

  // filename and parsedCount flow as arguments, never read from state
  const handleUpload = (data) => {
    const filename = data.filename;
    const parsedCount = data.parsed_count;

    setSessionId(data.sessionId);
    setLogs(data.sample);
    setError('');
    setCurrentStep('correlating');
    setTimeout(() => runCorrelation(data.sessionId, filename, parsedCount), 400);
  };

  const runCorrelation = async (id, filename, parsedCount) => {
    setLoading(true);
    try {
      const r = await axios.post(`${API_URL}/analysis/correlate`, { sessionId: id });
      setCorrelation(r.data);
      setCurrentStep('analyzing');
      setTimeout(() => runAnalysis(id, filename, parsedCount, r.data), 400);
    } catch (e) {
      setError('Correlation failed: ' + e.message);
    } finally { setLoading(false); }
  };

  const runAnalysis = async (id, filename, parsedCount, correlationData) => {
    setLoading(true);
    try {
      const r = await axios.post(`${API_URL}/analysis/claude`, { sessionId: id });
      setAnalysis(r.data.analysis);
      setCurrentStep('clustering');
      setTimeout(() => runClustering(id, filename, parsedCount, correlationData, r.data.analysis), 400);
    } catch (e) {
      setError('Analysis failed: ' + (e.response?.data?.error || e.message));
      setTimeout(() => runClustering(id, filename, parsedCount, correlationData, null), 800);
    } finally { setLoading(false); }
  };

  const runClustering = async (id, filename, parsedCount, correlationData, analysisData) => {
    setLoading(true);
    try {
      const r = await axios.post(`${API_URL}/patterns/cluster`, { sessionId: id });
      setClusters(r.data.clusters);
      setCurrentStep('reporting');
      setTimeout(() => generateReport(id, filename, parsedCount, correlationData, analysisData), 400);
    } catch (e) {
      setError('Clustering failed: ' + e.message);
      setTimeout(() => generateReport(id, filename, parsedCount, correlationData, analysisData), 800);
    } finally { setLoading(false); }
  };

  const generateReport = async (id, filename, parsedCount, correlationData, analysisData) => {
    setLoading(true);
    try {
      const r = await axios.post(`${API_URL}/reports/generate`, { sessionId: id });
      setReport(r.data);
      setCurrentStep('complete');
      // filename is the actual string here, not stale state
      saveToHistory(id, filename, parsedCount, analysisData, correlationData, r.data);
    } catch (e) {
      setError('Report failed: ' + e.message);
    } finally { setLoading(false); }
  };

  if (historyEntry) {
    return (
      <div className="app">
        <HistoryDetail entry={historyEntry} onBack={() => setHistoryEntry(null)} />
      </div>
    );
  }

  return (
    <div className="app">
      <Dashboard stats={{
        incidents:     correlation ? correlation.patterns.length : 0,
        threats:       clusters ? clusters.length : 0,
        high_severity: clusters ? clusters.filter(c => c.severity === 'CRITICAL').length : 0,
      }} />

      {error && <div className="alert alert-error">⚠ {error}</div>}

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

          {currentStep === 'complete' && !loading && (
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 16 }}>
              <button className="btn btn-ghost" onClick={resetAll} style={{ gap: 8, fontSize: 13 }}>
                ＋ Analyze Another Log
              </button>
            </div>
          )}
        </>
      )}

      <HistoryPanel onViewDetail={(entry) => setHistoryEntry(entry)} />
    </div>
  );
}

export default App;
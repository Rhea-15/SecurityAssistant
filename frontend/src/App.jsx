import React, { useState, useRef } from 'react';
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
  const [debugInfo, setDebugInfo] = useState(''); // For debugging

  const addDebug = (msg) => {
    console.log(msg);
    setDebugInfo(prev => prev + '\n' + msg);
  };

  const handleUpload = (data) => {
    addDebug('✓ Upload successful. Session ID: ' + data.sessionId);
    setSessionId(data.sessionId);
    setLogs(data.sample);
    setError('');
    setCurrentStep('correlating');
    setDebugInfo(''); // Clear debug on new upload
    
    setTimeout(() => runCorrelation(data.sessionId), 500);
  };

  const runCorrelation = async (id) => {
    addDebug('🔄 Starting correlation analysis...');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/analysis/correlate`, {
        sessionId: id
      });
      addDebug('✓ Correlation complete. Found ' + (response.data.patterns?.length || 0) + ' patterns');
      setCorrelation(response.data);
      setCurrentStep('analyzing');
      
      setTimeout(() => runAnalysis(id), 500);
    } catch (err) {
      addDebug('✗ Correlation error: ' + err.message);
      setError('Correlation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (id) => {
    addDebug('🔄 Starting Claude AI analysis...');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/analysis/claude`, {
        sessionId: id
      });
      addDebug('✓ Claude analysis complete');
      console.log('Analysis response:', response.data);
      setAnalysis(response.data.analysis);
      setCurrentStep('clustering');
      
      setTimeout(() => runClustering(id), 500);
    } catch (err) {
      addDebug('✗ Analysis error: ' + err.message);
      setError('Analysis failed: ' + (err.response?.data?.error || err.message));
      setTimeout(() => runClustering(id), 1000);
    } finally {
      setLoading(false);
    }
  };

  const runClustering = async (id) => {
    addDebug('🔄 Starting pattern clustering...');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/patterns/cluster`, {
        sessionId: id
      });
      addDebug('✓ Clustering complete. Found ' + response.data.clusters?.length + ' cluster types');
      setClusters(response.data.clusters);
      setCurrentStep('reporting');
      
      setTimeout(() => generateReport(id), 500);
    } catch (err) {
      addDebug('✗ Clustering error: ' + err.message);
      setError('Clustering failed: ' + err.message);
      setTimeout(() => generateReport(id), 1000);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (id) => {
    addDebug('🔄 Generating incident report...');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/reports/generate`, {
        sessionId: id
      });
      addDebug('✓ Report generated successfully');
      setReport(response.data);
      setCurrentStep('complete');
    } catch (err) {
      addDebug('✗ Report error: ' + err.message);
      setError('Report generation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Dashboard stats={{
        incidents: correlation ? correlation.patterns.length : 0,
        threats: clusters ? clusters.length : 0,
        high_severity: clusters ? clusters.filter(c => c.severity === 'CRITICAL').length : 0
      }} />

      {error && <div className="alert alert-error" style={{ margin: '20px' }}>{error}</div>}

      {currentStep === 'upload' && (
        <LogUploader onUpload={handleUpload} />
      )}

      {sessionId && logs.length > 0 && (
        <>
          {loading && (
            <div className="loading-container">
              <div className="loading">
                🔄 {currentStep === 'correlating' && 'Analyzing log patterns...'}
                {currentStep === 'analyzing' && 'Claude AI is analyzing (30-60 seconds)...'}
                {currentStep === 'clustering' && 'Detecting attack patterns...'}
                {currentStep === 'reporting' && 'Generating report...'}
              </div>
            </div>
          )}

          {logs.length > 0 && <Timeline logs={logs} />}

          {correlation && !loading && <CorrelationView correlation={correlation} />}

          {analysis && !loading && <AnalysisResults analysis={analysis} />}

          {clusters && !loading && <PatternClusters clusters={clusters} />}

          {report && !loading && <IncidentReport report={report} analysis={analysis} />}

          {!loading && !correlation && (
            <div className="info-box">
              <p>⏳ Processing your logs... This may take a minute.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
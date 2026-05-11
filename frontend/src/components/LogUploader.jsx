import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function LogUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInput = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
      setError('');
    }
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const uploadLogs = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const content = await file.text();
      const response = await axios.post(`${API_URL}/logs/upload`, {
        content,
        filename: file.name
      });

      setSuccess(`✓ Uploaded ${response.data.parsed_count} log entries`);
      setFile(null);
      onUpload(response.data);
    } catch (err) {
      setError('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploader-container">
      <div className="uploader-box">
        <h2>📤 Upload Security Logs</h2>
        
        <div
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInput.current?.click()}
        >
          <div className="drop-icon">📁</div>
          <p>Drag logs here or click to upload</p>
          <p className="drop-hint">Supports JSON, CSV, SYSLOG formats</p>
          <input
            ref={fileInput}
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept=".json,.csv,.log,.txt"
          />
        </div>

        {file && (
          <div className="file-info">
            <p>Selected: <strong>{file.name}</strong></p>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={uploadLogs}
          disabled={!file || loading}
        >
          {loading ? 'Processing...' : 'Analyze Logs'}
        </button>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </div>
    </div>
  );
}

export default LogUploader;
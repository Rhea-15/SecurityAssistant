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
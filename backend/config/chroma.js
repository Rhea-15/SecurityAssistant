// Chroma vector DB configuration
// Placeholder for future vector DB integration

const chromaConfig = {
    host: process.env.CHROMA_HOST || 'localhost',
    port: process.env.CHROMA_PORT || 8000,
    ssl: false
  };
  
  module.exports = chromaConfig;
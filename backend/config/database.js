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
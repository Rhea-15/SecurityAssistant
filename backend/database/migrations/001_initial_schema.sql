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
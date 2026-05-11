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
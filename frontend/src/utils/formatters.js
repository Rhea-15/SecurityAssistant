function getSeverityColor(severity) {
  const colors = {
    'CRITICAL': '#dc2626',
    'HIGH': '#ea580c',
    'MEDIUM': '#eab308',
    'LOW': '#16a34a'
  };
  return colors[severity] || '#6b7280';
}

function copyToClipboard(text) {
  if (Array.isArray(text)) {
    text = text.join('\n');
  }
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
}

export { getSeverityColor, copyToClipboard };
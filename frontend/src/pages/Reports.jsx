import React from 'react';
import IncidentReport from '../components/IncidentReport';

function Reports({ report, analysis }) {
  return (
    <div className="reports-page">
      {report && <IncidentReport report={report} analysis={analysis} />}
    </div>
  );
}

export default Reports;
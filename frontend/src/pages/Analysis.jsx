import React from 'react';
import CorrelationView from '../components/CorrelationView';
import AnalysisResults from '../components/AnalysisResults';

function Analysis({ correlation, analysis }) {
  return (
    <div className="analysis-page">
      {correlation && <CorrelationView correlation={correlation} />}
      {analysis && <AnalysisResults analysis={analysis} />}
    </div>
  );
}

export default Analysis;
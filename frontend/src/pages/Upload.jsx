import React from 'react';
import LogUploader from '../components/LogUploader';

function Upload({ onUpload }) {
  return (
    <div className="upload-page">
      <LogUploader onUpload={onUpload} />
    </div>
  );
}

export default Upload;
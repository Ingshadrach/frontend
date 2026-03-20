import React from 'react';

const Saved = () => {
  return (
    <div>
      <h1 className="page-header">Saved Jobs</h1>
      
      <div className="empty-state">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>No saved jobs</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Click the bookmark icon on jobs you are interested in, and they will be saved here for later.
        </p>
      </div>
    </div>
  );
};

export default Saved;

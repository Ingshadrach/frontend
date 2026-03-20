import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle } from 'lucide-react';

const Verifications = () => {
  const { user } = useAuth();
  
  // Empty data as per requirements
  const [requests, setRequests] = useState([]);

  const handleAction = (id, action) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
    alert(`Request ${id} marked as ${action}`);
  };

  if (user?.role !== 'ADMIN') return <p>Access Denied</p>;

  return (
    <div>
      <h1 className="page-header">Employer Verifications</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Review identity documents and approve trusted employers.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.map((request) => (
          <div key={request.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {request.company}
                {request.status === 'APPROVED' && <CheckCircle2 size={16} fill="#3B82F6" color="white" />}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Contact: {request.phone}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Submitted: {request.date}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ 
                fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '1rem',
                backgroundColor: request.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : request.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: request.status === 'APPROVED' ? 'var(--success)' : request.status === 'REJECTED' ? 'var(--danger)' : '#F59E0B'
              }}>
                {request.status}
              </span>
              
              {request.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button onClick={() => handleAction(request.id, 'APPROVED')} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: 'var(--success)', minWidth: 0 }}>
                    Approve
                  </button>
                  <button onClick={() => handleAction(request.id, 'REJECTED')} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', color: 'var(--danger)', borderColor: 'var(--danger)', minWidth: 0 }}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="empty-state">
            <h3>No pending verifications</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verifications;

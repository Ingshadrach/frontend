import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('konnect_token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Applications
        const appsRes = await axios.get(`${API_BASE_URL}/applications`, { headers });
        setApplications(appsRes.data);

        // Fetch Interviews for Seekers
        if (user.role === 'SEEKER') {
          const intRes = await axios.get(`${API_BASE_URL}/interviews`, { headers });
          setInterviews(intRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const acceptSlot = async (id, slot) => {
    try {
      await axios.post(`${API_BASE_URL}/interviews/accept/${id}`, { selectedSlot: slot }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      alert('Interview Scheduled!');
      // reload
      const res = await axios.get(`${API_BASE_URL}/interviews`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      setInterviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestCV = async (appId) => {
    try {
      await axios.put(`${API_BASE_URL}/applications/${appId}/request-cv`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      // Refresh
      const res = await axios.get(`${API_BASE_URL}/applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to request CV');
    }
  };

  const handleUploadCV = async (appId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('cv', file);

    try {
      await axios.post(`${API_BASE_URL}/applications/${appId}/upload-cv`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('konnect_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      // Refresh
      const res = await axios.get(`${API_BASE_URL}/applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      setApplications(res.data);
      alert('CV sent successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload CV. Please ensure it is a PDF under 5MB.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1 className="page-header">{user?.role === 'CREATOR' || user?.role === 'ADMIN' ? 'Received Applications' : 'My Applications'}</h1>
      
      {user?.role === 'SEEKER' && interviews.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>Interview Invitations</h2>
          {interviews.map(inv => (
            <div key={inv.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{inv.job?.title} at {inv.job?.company}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Status: <strong>{inv.status}</strong></p>
              
              {inv.status === 'PENDING' ? (
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Select a time slot:</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {JSON.parse(inv.proposedSlots).map(slot => (
                      <button key={slot} onClick={() => acceptSlot(inv.id, slot)} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                        {new Date(slot).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--success)', fontWeight: 600 }}>Confirmed for: {new Date(inv.selectedSlot).toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {applications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map(app => (
            <div key={app.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)' }}>
                    {user?.role === 'SEEKER' ? app.job?.title : `Applicant: ${app.applicant?.phone || 'Unknown'}`}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {user?.role === 'SEEKER' ? `${app.job?.company} • ${app.job?.location}` : `Job: ${app.job?.title}`}
                  </p>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    backgroundColor: app.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.1)' : 
                                     app.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 
                                     'rgba(59, 130, 246, 0.1)',
                    color: app.status === 'ACCEPTED' ? 'var(--success)' : 
                           app.status === 'REJECTED' ? 'var(--error)' : 
                           'var(--primary)'
                  }}>
                    {app.status}
                  </span>

                  {/* Creator Actions for CV */}
                  {(user?.role === 'CREATOR' || user?.role === 'ADMIN') && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {!app.cvRequested ? (
                        <button 
                          onClick={() => handleRequestCV(app.id)}
                          className="btn btn-primary"
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                        >
                          Send CV (Request)
                        </button>
                      ) : app.cvUrl ? (
                        <a 
                          href={`${API_BASE_URL.replace('/api', '')}${app.cvUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-success"
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', textDecoration: 'none', display: 'inline-block' }}
                        >
                          View CV
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          Waiting for CV...
                        </span>
                      )}
                    </div>
                  )}

                  {/* Seeker View for CV status */}
                  {user?.role === 'SEEKER' && app.cvUrl && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, marginTop: '0.5rem' }}>
                      ✓ CV Sent
                    </span>
                  )}
                </div>
              </div>

              {/* Seeker CV Request & Upload UI */}
              {user?.role === 'SEEKER' && app.cvRequested && !app.cvUrl && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  backgroundColor: 'rgba(59, 130, 246, 0.05)', 
                  borderRadius: '0.5rem',
                  borderLeft: '4px solid var(--primary)'
                }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    The employer has requested your CV. Please upload a PDF version below.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="file" 
                      accept=".pdf"
                      id={`cv-upload-${app.id}`}
                      style={{ fontSize: '0.875rem' }}
                    />
                    <button 
                      onClick={() => {
                        const file = document.getElementById(`cv-upload-${app.id}`).files[0];
                        handleUploadCV(app.id, file);
                      }}
                      className="btn btn-primary"
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                    >
                      Upload & Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>No applications to display</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            {user?.role === 'CREATOR' || user?.role === 'ADMIN' 
              ? 'When job seekers apply to your postings, they will appear here.'
              : 'You have not applied to any jobs recently. Browse available jobs to start applying.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Applications;

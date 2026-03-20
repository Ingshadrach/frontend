import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { CheckCircle, MapPin, DollarSign, Calendar, Trash2 } from 'lucide-react';
import API_BASE_URL from '../api/config';

const Home = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (user && user.role === 'SEEKER') {
          const res = await axios.get(`${API_BASE_URL}/jobs/recommendations`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
          });
          setJobs(res.data);
        } else {
          const res = await axios.get(`${API_BASE_URL}/jobs`);
          setJobs(res.data);
        }
      } catch (err) {
        console.error(err);
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setJobs(savedJobs);
      }
    };
    fetchJobs();
  }, [user]);
  
  const handleApply = async (jobId) => {
    if (!user) {
      alert('Please login to apply for jobs');
      return;
    }
    
    try {
      await axios.post(`${API_BASE_URL}/applications`, { jobId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      alert('Application submitted successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to submit application');
    }
  };
  
  const [showConfirm, setShowConfirm] = useState(null);

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`${API_BASE_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      setJobs(jobs.filter(job => job.id !== jobId));
      setShowConfirm(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to delete job');
    }
  };

  return (
    <div>
      <h1 className="page-header">{user?.role === 'SEEKER' ? 'Recommended Jobs' : 'Available Jobs'}</h1>
      
      {/* Search Bar (Visual Only for MVP) */}
      <div className="input-group" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input type="text" className="input" placeholder="Search by job title or keyword..." />
        <button className="btn">Search</button>
      </div>

      {jobs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map(job => (
            <div key={job.id} className="card" style={{ padding: '1.5rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* Company Avatar */}
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '0.75rem', 
                    backgroundColor: 'var(--bg-secondary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    flexShrink: 0
                  }}>
                    {job.creator?.profile?.picture ? (
                      <img src={job.creator.profile.picture} alt={job.creator.name || job.company} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>
                        {(job.creator?.name || job.company || '?').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {job.title}
                      {job.isFeatured && (
                        <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: '0.1rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                          Featured
                        </span>
                      )}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 500, color: 'var(--primary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {job.creator?.name || job.company}
                        {job.creator?.verification?.status === 'APPROVED' && (
                          <CheckCircle size={14} style={{ color: 'var(--success)', fill: 'rgba(16, 185, 129, 0.1)' }} title="Verified Company" />
                        )}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} /> {job.location}
                      </span>
                    </div>
                  </div>
                </div>
                {job.salary && (
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <DollarSign size={14} /> {job.salary}
                  </span>
                )}
              </div>
              
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                {job.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {(!user || user.role === 'SEEKER') && (
                  <button 
                    onClick={() => handleApply(job.id)}
                    className="btn" 
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                  >
                    Apply Now
                  </button>
                )}
                {(user && user.role === 'CREATOR' && job.creatorId === user.id) && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {showConfirm === job.id ? (
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 600 }}>Confirm?</span>
                        <button 
                          onClick={() => handleDelete(job.id)}
                          className="btn"
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#EF4444', border: 'none', minWidth: 'auto' }}
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => setShowConfirm(null)}
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderColor: 'var(--text-muted)', color: 'var(--text-muted)', minWidth: 'auto' }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowConfirm(job.id)}
                        className="btn btn-danger" 
                        style={{ 
                          padding: '0.5rem 1.25rem', 
                          fontSize: '0.875rem', 
                          backgroundColor: '#EF4444', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem' 
                        }}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>No jobs available yet</h2>
          <p style={{ marginBottom: '1.5rem' }}>Check back later or post a new job if you are looking to hire.</p>
          {(!user || user.role !== 'SEEKER') && (
            <Link to="/post-job" className="btn">Post a Job</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

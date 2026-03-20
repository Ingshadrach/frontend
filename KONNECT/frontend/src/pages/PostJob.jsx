import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirements: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/jobs`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      alert('Job posted successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post job. Make sure you are logged in as an Employer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-header">Post a New Job</h1>
      
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Job Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Senior Software Engineer"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Company Name</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Konnect Inc."
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Location</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Freetown, SL"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Salary Range (Optional)</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. 5,000 - 8,000 SLE"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>Job Description</label>
            <textarea 
              className="input" 
              rows="4"
              placeholder="Describe the role and responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <div className="input-group">
            <label>Requirements (Optional)</label>
            <textarea 
              className="input" 
              rows="3"
              placeholder="e.g. 2+ years experience, Degree in..."
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
            ></textarea>
          </div>

          {error && (
            <p style={{ color: 'red', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
          )}

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

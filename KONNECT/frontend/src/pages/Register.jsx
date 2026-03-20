import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('SEEKER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        ...formData,
        role,
      });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="form-container" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="large" justify="center" />
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Create your account
          </p>
        </div>

        {error && (
          <p style={{ color: 'red', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
              I am registering as:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setRole('SEEKER')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  border: `2px solid ${role === 'SEEKER' ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: role === 'SEEKER' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  color: role === 'SEEKER' ? 'var(--primary)' : 'var(--text)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole('CREATOR')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  border: `2px solid ${role === 'CREATOR' ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: role === 'CREATOR' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  color: role === 'CREATOR' ? 'var(--primary)' : 'var(--text)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Company
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="name">
              {role === 'SEEKER' ? 'Full Name' : 'Company Name'}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={role === 'SEEKER' ? 'Enter your full name' : 'Enter company name'}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@mail.com"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import API_BASE_URL from '../api/config';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isApplyingVerification, setIsApplyingVerification] = useState(false);
  const [badges, setBadges] = useState([]);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE_URL}/profiles/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
        });
        const data = await res.json();
        if (data && !data.error) {
          setProfileData({
            name: user.name || '',
            email: user.email || '',
            bio: data.bio || '',
            picture: data.picture || '',
            skills: data.skills || '',
            experience: data.experience || '',
            education: data.education || '',
            location: data.location || '',
            availableNow: data.availableNow || false,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchProfile();

    if (user?.role === 'SEEKER') {
      fetch(`${API_BASE_URL}/assessments/my-results`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBadges(data.filter(d => d.passed) || []);
        }
      })
      .catch(console.error);
    }
  }, [user]);
  
  // Local state for edits
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    picture: '',
    skills: '',
    experience: '',
    education: '',
    location: '',
    availableNow: false,
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/profiles/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('konnect_token')}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!data.error) {
        // Also update the user object in context if name/email changed (though we only update profile fields here)
        // For simplicity, we just stop editing
        setIsEditing(false);
        alert('Profile updated and saved to database!');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    }
  };

  const handleApplyVerification = () => {
    // Mock Verification Application
    setIsApplyingVerification(true);
    setTimeout(() => {
      const verifiedUser = { ...user, isVerified: false, status: 'PENDING' };
      login(verifiedUser, 'mock-jwt-token');
      setIsApplyingVerification(false);
      alert("Application sent! Awaiting Admin Approval.");
    }, 1000);
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-header" style={{ marginBottom: 0 }}>My Profile</h1>
        <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
          Logout
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <label style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden', cursor: 'pointer', position: 'relative' }} title="Upload Profile Picture">
          <input 
            type="file" 
            accept="image/*"
            style={{ display: 'none' }}
            onChange={async (e) => {
              if (e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                  const newPicture = event.target.result;
                  setProfileData(prev => ({...prev, picture: newPicture}));
                  // Auto-save picture
                  try {
                    await fetch(`${API_BASE_URL}/profiles/me`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('konnect_token')}`
                      },
                      body: JSON.stringify({ ...profileData, picture: newPicture })
                    });
                  } catch (err) {
                    console.error('Failed to auto-save picture', err);
                  }
                };
                reader.readAsDataURL(e.target.files[0]);
              }
            }} 
          />
          {profileData.picture ? (
            <img src={profileData.picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user?.name ? user.name.charAt(0).toUpperCase() : (user?.phone ? user.phone.charAt(0) : 'U')
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '1rem', lineHeight: 1 }}>+</span>
          </div>
        </label>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{user?.name || user?.phone || 'User Name'}</h2>
            {user?.isVerified && (
              <CheckCircle2 size={20} fill="#3B82F6" color="white" style={{ flexShrink: 0 }} />
            )}
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Role: {user?.role}</p>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ height: '8px', width: '150px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: user?.name ? '100%' : '20%', backgroundColor: 'var(--success)' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.name ? '100% Complete' : '20% Complete'}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Profile Details</h3>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Edit</button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSave}>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="input" 
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                required 
              />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="input" 
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
              />
            </div>
            <div className="input-group">
              <label>Bio</label>
              <textarea 
                className="input" 
                rows="3" 
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})} 
              />
            </div>
            <div className="input-group">
              <label>Location</label>
              <input 
                type="text" 
                className="input" 
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})} 
              />
            </div>
            <div className="input-group">
              <label>Skills (comma separated)</label>
              <input 
                type="text" 
                className="input" 
                value={profileData.skills}
                onChange={(e) => setProfileData({...profileData, skills: e.target.value})} 
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="btn">Save Changes</button>
            </div>
          </form>
        ) : (
          <div>
            {profileData.bio ? (
              <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>{profileData.bio}</p>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Your profile is looking a bit empty. Update your details to stand out.</p>
            )}
            {user?.email && <p style={{ fontSize: '0.875rem' }}><strong>Email:</strong> {user.email}</p>}
            {profileData.location && <p style={{ fontSize: '0.875rem' }}><strong>Location:</strong> {profileData.location}</p>}
            {profileData.skills && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Skills:</strong>
                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{profileData.skills}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {user?.role === 'SEEKER' && badges.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Verified Skills</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {badges.map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> {b.skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.role === 'CREATOR' && (
        <div className="card" style={{ border: '1px solid var(--primary)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary)', borderRadius: '50%', color: 'white' }}>
              <CheckCircle2 size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>Get Verified</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Build trust with job seekers by verifying your company identity. A verified badge will instantly appear on your profile and published jobs.</p>
              
              {user.isVerified ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)' }}>
                  <CheckCircle2 size={16} /> Verified Employer
                </div>
              ) : user.status === 'PENDING' ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#F59E0B' }}>
                  Verification Pending
                </div>
              ) : (
                <button 
                  onClick={handleApplyVerification} 
                  className="btn" 
                  disabled={isApplyingVerification}
                >
                  {isApplyingVerification ? 'Submitting...' : 'Apply for Verification'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

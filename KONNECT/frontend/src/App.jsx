import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import axios from 'axios';
import API_BASE_URL from './api/config';
import { Trash2, User, Mail, Phone, Calendar, Shield, X, Check } from 'lucide-react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob';
import Applications from './pages/Applications';
import Saved from './pages/Saved';
import CVBuilder from './pages/CVBuilder';
import Verifications from './pages/Verifications';
import Reviews from './pages/Reviews';

// Admin User Management Component
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // stores userId to confirm
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      setUsers(users.filter(u => u.id !== userId));
      setConfirmDelete(null);
      alert('User deleted successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
      setConfirmDelete(null);
    }
  };

  if (currentUser?.role !== 'ADMIN') return <div className="app-container"><div className="empty-state">Access Denied</div></div>;

  return (
    <div className="admin-container">
      <h1 className="page-header">User Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Total Users: {users.length}</p>

      {loading ? (
        <div className="empty-state">Loading users...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {users.map(u => (
            <div key={u.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <User size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{u.name || 'No Name'}</h3>
                  <span style={{ 
                    fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '1rem', 
                    backgroundColor: u.role === 'ADMIN' ? 'rgba(59,130,246,0.1)' : u.role === 'CREATOR' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                    color: u.role === 'ADMIN' ? 'var(--primary)' : u.role === 'CREATOR' ? 'var(--success)' : 'var(--text-muted)'
                  }}>
                    {u.role}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {u.email && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={14} /> {u.email}</span>}
                  {u.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={14} /> {u.phone}</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ marginLeft: '1rem' }}>
                {u.id !== currentUser.id && (
                  confirmDelete === u.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 600 }}>Confirm?</span>
                      <button onClick={() => deleteUser(u.id)} className="btn-icon" style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.4rem' }}>
                        <Check size={16} />
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="btn-icon" style={{ backgroundColor: 'var(--text-muted)', color: 'white', padding: '0.4rem' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(u.id)} className="btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.5rem', minWidth: 0 }}>
                      <Trash2 size={20} />
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="app-container"><div className="empty-state">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="app-container"><div className="empty-state">Loading...</div></div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
              <Route path="saved" element={<ProtectedRoute allowedRoles={['SEEKER']}><Saved /></ProtectedRoute>} />
              <Route path="cv-builder" element={<ProtectedRoute allowedRoles={['SEEKER']}><CVBuilder /></ProtectedRoute>} />
              <Route path="reviews" element={<ProtectedRoute allowedRoles={['SEEKER']}><Reviews /></ProtectedRoute>} />
              <Route path="post-job" element={<ProtectedRoute allowedRoles={['CREATOR', 'ADMIN']}><PostJob /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
              <Route path="verifications" element={<ProtectedRoute allowedRoles={['ADMIN']}><Verifications /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

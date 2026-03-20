import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Home, Briefcase, User, Bell, Bookmark, Handshake, FileText, LogOut, MessageSquare, Award, Star, BarChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getLinks = () => {
    switch (user?.role) {
      case 'SEEKER':
        return [
          { to: '/', label: 'Home', icon: <Home size={20} /> },
          { to: '/applications', label: 'Applications', icon: <Briefcase size={20} /> },
          { to: '/saved', label: 'Saved', icon: <Bookmark size={20} /> },
          { to: '/reviews', label: 'Reviews', icon: <Star size={20} /> },
          { to: '/cv-builder', label: 'CV Builder', icon: <FileText size={20} /> },
          { to: '/profile', label: 'Profile', icon: <User size={20} /> }
        ];
      case 'CREATOR':
        return [
          { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
          { to: '/post-job', label: 'Post Job', icon: <Briefcase size={20} /> },
          { to: '/applications', label: 'Applications', icon: <Briefcase size={20} /> },
          { to: '/profile', label: 'Profile', icon: <User size={20} /> }
        ];
      case 'ADMIN':
        return [
          { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
          { to: '/users', label: 'Users', icon: <User size={20} /> },
          { to: '/verifications', label: 'Verifications', icon: <Briefcase size={20} /> },
        ];
      default:
        return [
          { to: '/login', label: 'Login', icon: <User size={20} /> }
        ];
    }
  };

  const links = getLinks();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar (Left) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border h-full" style={{ padding: '1.5rem 1rem', display: 'none', backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <div style={{ padding: '0 0.75rem', marginBottom: '2.5rem' }}>
          <Logo />
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {links.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: location.pathname === link.to ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: location.pathname === link.to ? '#3B82F6' : 'var(--text-muted)',
                fontWeight: location.pathname === link.to ? 600 : 500,
                transition: 'all 0.2s ease'
              }}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        {user && (
          <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.phone}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{user.role}</div>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline" 
              style={{ width: '100%', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)', fontSize: '0.875rem' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="md:hidden">
          <span className="logo-text">Konnect</span>
          <Bell size={24} color="var(--text-muted)" />
        </header>

        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="glass md:hidden" style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        display: 'flex', justifyContent: 'space-around', alignItems: 'center', 
        padding: '0.75rem 0', zIndex: 50 
      }}>
        {links.map(link => (
          <Link 
            key={link.to} 
            to={link.to}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
              color: location.pathname === link.to ? 'var(--primary)' : 'var(--text-muted)',
            }}
          >
            {link.icon}
            <span style={{ fontSize: '0.7rem', fontWeight: location.pathname === link.to ? '600' : '400' }}>{link.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* Quick CSS inline patch for responsive sidebar since we don't have tailwind config */}
      <style>{`
        @media (min-width: 768px) {
          .md\\:hidden { display: none !important; }
          .md\\:flex { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;

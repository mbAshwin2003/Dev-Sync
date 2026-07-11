import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Users, Briefcase, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            DevSync
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {user && (
            <ul className="nav-links">
              <li>
                <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                  <Briefcase size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/partners" className={`nav-link ${isActive('/partners') ? 'active' : ''}`}>
                  <Users size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Find Partners
                </Link>
              </li>
              <li>
                <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                  <UserIcon size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Profile
                </Link>
              </li>
            </ul>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'} 
                  alt={user.name} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid hsl(var(--primary))' }}
                />
                <button onClick={logout} className="glow-btn" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/profile" className="glow-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

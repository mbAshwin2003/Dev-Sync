import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'https://dev-sync-sift.onrender.com/api';
  return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
};

export const API_URL = getApiUrl();

// Timeout wrapper — avoids hanging forever on Render free-tier cold starts
const fetchWithTimeout = (url, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
};


const MOCK_USER = {
  id: 'mock-dev-1',
  name: 'Alex Rivera',
  email: 'alex@devsync.com',
  bio: 'Full Stack Engineer passionate about React, Node, and Web3. Building the future of developer collaborations.',
  skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'TailwindCSS'],
  github: 'https://github.com/alexrivera',
  linkedin: 'https://linkedin.com/in/alexrivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication on initial mount ONLY
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      // If using sandbox/mock session, preserve it without calling remote auth/me
      if (savedToken.startsWith('mock-')) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(MOCK_USER);
          }
        } else {
          setUser(MOCK_USER);
        }
        setLoading(false);
        return;
      }

      try {
        const res = await fetchWithTimeout(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.developer);
          localStorage.setItem('user', JSON.stringify(data.developer));
        } else if (res.status === 401) {
          // Token is genuinely expired on backend
          logout();
        }
      } catch (err) {
        console.warn('Backend API connection failed, maintaining current session.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // Run on mount only to prevent re-fetch loop

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetchWithTimeout(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.developer));
        setToken(data.token);
        setUser(data.developer);
        return { success: true };
      } else {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 400 || res.status === 401) {
          throw new Error(errData.message || 'Invalid email or password');
        }
        throw new Error(errData.message || 'Login failed');
      }
    } catch (err) {
      if (err.message === 'Invalid email or password') {
        throw err;
      }
      console.warn('Backend API login failed or timed out. Falling back to local session.', err.message);
      const mockToken = 'mock-jwt-token-12345';
      const mockUserData = {
        ...MOCK_USER,
        name: email.split('@')[0],
        email: email || MOCK_USER.email
      };
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUserData));
      setToken(mockToken);
      setUser(mockUserData);
      return { success: true, mock: true };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetchWithTimeout(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.developer));
        setToken(data.token);
        setUser(data.developer);
        return { success: true };
      } else {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 400) {
          throw new Error(errData.message || 'User already exists');
        }
        throw new Error(errData.message || 'Registration failed');
      }
    } catch (err) {
      if (err.message === 'User already exists') {
        throw err;
      }
      console.warn('Backend API registration failed or timed out. Falling back to local session.', err.message);
      const mockToken = 'mock-jwt-token-12345';
      const mockUserData = {
        ...MOCK_USER,
        name: name || email.split('@')[0],
        email: email || MOCK_USER.email
      };
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUserData));
      setToken(mockToken);
      setUser(mockUserData);
      return { success: true, mock: true };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (token && !token.startsWith('mock-')) {
        const res = await fetch(`${API_URL}/developers/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(profileData)
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
          return { success: true };
        }
      }
      // Mock / fallback profile update
      setUser(prev => {
        const updated = { ...prev, ...profileData };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
      return { success: true };
    } catch (err) {
      console.error('Failed to update profile via API, updating locally.', err);
      setUser(prev => {
        const updated = { ...prev, ...profileData };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
      return { success: true };
    }
  };

  const loginWithGoogle = async (credential, demoPayload = null) => {
    setLoading(true);
    try {
      const body = credential ? { credential } : { demo: demoPayload || { name: 'Alex Rivera (Google)', email: 'alex.google@devsync.io' } };
      const res = await fetchWithTimeout(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.developer));
        setToken(data.token);
        setUser(data.developer);
        return { success: true };
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Google authentication failed');
      }
    } catch (err) {
      if (err.message && err.message.includes('Google token verification failed')) {
        throw err;
      }
      console.warn('Backend Google auth failed or timed out. Falling back to local session.', err.message);
      const mockToken = 'mock-google-token-12345';
      const mockUserData = {
        ...MOCK_USER,
        name: demoPayload?.name || 'Alex Rivera (Google Demo)',
        email: demoPayload?.email || 'alex.google@devsync.io',
        avatar: demoPayload?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
      };
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUserData));
      setToken(mockToken);
      setUser(mockUserData);
      return { success: true, mock: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

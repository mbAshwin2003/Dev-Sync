import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api';

// Fallback mock developers and project data if backend is down
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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.developer);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.warn('Backend API connection failed, running in sandbox/mock mode.');
        // Fallback: If they had a token stored, mock log them in
        setUser(MOCK_USER);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.developer);
        return { success: true };
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Login failed');
      }
    } catch (err) {
      console.warn('Backend API login failed. Logging in using mock data.');
      // Mock login for offline demonstration
      const mockToken = 'mock-jwt-token-12345';
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser({
        ...MOCK_USER,
        email: email || MOCK_USER.email
      });
      return { success: true, mock: true };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.developer);
        return { success: true };
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }
    } catch (err) {
      console.warn('Backend API registration failed. Registering using mock data.');
      const mockToken = 'mock-jwt-token-12345';
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser({
        ...MOCK_USER,
        name,
        email
      });
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
          return { success: true };
        }
      }
      // Mock / fallback profile update
      setUser(prev => ({ ...prev, ...profileData }));
      return { success: true };
    } catch (err) {
      console.error('Failed to update profile via API, updating locally.', err);
      setUser(prev => ({ ...prev, ...profileData }));
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
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

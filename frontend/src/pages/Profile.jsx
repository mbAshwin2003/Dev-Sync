import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Github, Linkedin, Lock, Save, Edit, UserPlus, LogIn } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, login, register, updateProfile } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Authentication Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Profile Edit Fields
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditBio(user.bio || '');
      setEditSkills(user.skills?.join(', ') || '');
      setEditGithub(user.github || '');
      setEditLinkedin(user.linkedin || '');
      setEditAvatar(user.avatar || '');
    }
  }, [user]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegisterMode) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    const profileData = {
      name: editName,
      bio: editBio,
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
      github: editGithub,
      linkedin: editLinkedin,
      avatar: editAvatar
    };
    const result = await updateProfile(profileData);
    if (result.success) {
      setIsEditMode(false);
    } else {
      setError('Could not update profile. Try again.');
    }
  };

  const startEditing = () => {
    if (user) {
      setEditName(user.name || '');
      setEditBio(user.bio || '');
      setEditSkills(user.skills?.join(', ') || '');
      setEditGithub(user.github || '');
      setEditLinkedin(user.linkedin || '');
      setEditAvatar(user.avatar || '');
    }
    setIsEditMode(true);
  };

  if (!user) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', padding: '20px' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
            <span className="gradient-text">{isRegisterMode ? 'Create Account' : 'Welcome Back'}</span>
          </h2>
          <p style={{ color: 'hsl(var(--muted))', textAlign: 'center', marginBottom: '32px' }}>
            {isRegisterMode ? 'Join DevSync to find matching partners' : 'Sign in to access your dashboard'}
          </p>

          {error && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {isRegisterMode && (
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted))' }} />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted))' }} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted))' }} />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
              />
            </div>

            <button type="submit" className="glow-btn" disabled={submitting} style={{ justifyContent: 'center', padding: '12px', marginTop: '10px', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? (
                <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : isRegisterMode ? <UserPlus size={16} /> : <LogIn size={16} />}
              {submitting ? (isRegisterMode ? 'Creating Account...' : 'Signing In...') : isRegisterMode ? 'Register' : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'hsl(var(--muted))' }}>
            {isRegisterMode ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button 
              onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'hsl(var(--primary))', cursor: 'pointer', fontWeight: 600, padding: 0 }}
            >
              {isRegisterMode ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <div className="glass-panel" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        {isEditMode ? (
          // Edit Profile Mode
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '10px' }}>Edit Profile</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Name</label>
                <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Avatar Image URL</label>
                <input type="text" value={editAvatar} onChange={(e) => setEditAvatar(e.target.value)} placeholder="https://images.unsplash.com/..." />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Bio</label>
              <textarea rows={4} value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Tell other developers about yourself..." />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Skills (comma-separated)</label>
              <input type="text" value={editSkills} onChange={(e) => setEditSkills(e.target.value)} placeholder="React, Node.js, Python, Rust" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}><Github size={14} style={{ marginRight: '6px' }} />GitHub URL</label>
                <input type="text" value={editGithub} onChange={(e) => setEditGithub(e.target.value)} placeholder="https://github.com/..." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}><Linkedin size={14} style={{ marginRight: '6px' }} />LinkedIn URL</label>
                <input type="text" value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button type="button" className="theme-btn" style={{ padding: '10px 20px' }} onClick={() => setIsEditMode(false)}>
                Cancel
              </button>
              <button type="submit" className="glow-btn">
                <Save size={14} />
                Save Profile
              </button>
            </div>
          </form>
        ) : (
          // View Profile Mode
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid hsl(var(--card-border))', paddingBottom: '32px', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
                  alt={user.name}
                  style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid hsl(var(--primary))' }}
                />
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{user.name}</h2>
                  <p style={{ color: 'hsl(var(--muted))', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Mail size={14} />
                    {user.email}
                  </p>
                </div>
              </div>
              <button className="glow-btn" onClick={startEditing}>
                <Edit size={14} />
                Edit Profile
              </button>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>About Me</h3>
              <p style={{ opacity: 0.85, fontSize: '1.05rem', lineHeight: '1.6' }}>
                {user.bio || "No bio set. Click 'Edit Profile' to add details about yourself."}
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>My Tech Stack</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="badge" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>{skill}</span>
                  ))
                ) : (
                  <p style={{ color: 'hsl(var(--muted))' }}>No skills listed yet.</p>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid hsl(var(--card-border))', paddingTop: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>Social Profiles</h3>
              <div style={{ display: 'flex', gap: '16px' }}>
                {user.github ? (
                  <a href={user.github} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ padding: '10px 18px', background: 'transparent', border: '1px solid hsl(var(--card-border))', color: 'hsl(var(--foreground))' }}>
                    <Github size={16} />
                    GitHub
                  </a>
                ) : (
                  <span style={{ color: 'hsl(var(--muted))', fontSize: '0.9rem' }}>No GitHub linked</span>
                )}
                {user.linkedin ? (
                  <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ padding: '10px 18px', background: 'transparent', border: '1px solid hsl(var(--card-border))', color: 'hsl(var(--foreground))' }}>
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                ) : (
                  <span style={{ color: 'hsl(var(--muted))', fontSize: '0.9rem' }}>No LinkedIn linked</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

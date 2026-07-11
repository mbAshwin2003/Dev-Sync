import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import { LayoutDashboard, Plus, Send, Sparkles, FolderKanban } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const MOCK_PROJECTS = [
  {
    _id: 'mock-proj-1',
    title: 'AI Code Companion',
    description: 'Developing an open-source extension that uses machine learning to write code tests automatically for React applications.',
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'LLMs', 'VS Code API'],
    status: 'searching',
    owner: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80' }
  },
  {
    _id: 'mock-proj-2',
    title: 'Decentralized Freelance Platform',
    description: 'A Web3 project matching clients with freelancers with smart contract-based payments and escrow mechanisms.',
    skillsRequired: ['Solidity', 'Ethereum', 'React', 'Ethers.js'],
    status: 'active',
    owner: { name: 'Vitalik Nakamoto', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80' }
  },
  {
    _id: 'mock-proj-3',
    title: 'Greenhouse Automation Client',
    description: 'An IoT dashboard built to monitor soil moisture, temperature, and automation controls for hobby farmers.',
    skillsRequired: ['React', 'Python', 'MQTT', 'Raspberry Pi'],
    status: 'searching',
    owner: { name: 'Marcus Miller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80' }
  }
];

const Dashboard = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (skillsFilter) queryParams.append('skills', skillsFilter);

      const res = await fetch(`${API_URL}/projects?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        // If API succeeded but database returned empty, merge with mock projects
        if (data.length === 0 && !searchQuery && !skillsFilter) {
          setProjects(MOCK_PROJECTS);
        } else {
          setProjects(data);
        }
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.warn('Could not fetch projects from API, using simulated state.');
      // Filter mock projects locally
      let filtered = [...MOCK_PROJECTS];
      if (searchQuery) {
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (skillsFilter) {
        const filterArray = skillsFilter.split(',').map(s => s.trim().toLowerCase());
        filtered = filtered.filter(p => 
          p.skillsRequired.some(s => filterArray.includes(s.toLowerCase()))
        );
      }
      setProjects(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, skillsFilter]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const projectData = {
      title,
      description,
      skillsRequired: skillsRequired.split(',').map(s => s.trim())
    };

    try {
      if (token && !token.startsWith('mock-')) {
        const res = await fetch(`${API_URL}/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(projectData)
        });
        if (res.ok) {
          const newProject = await res.json();
          setProjects([newProject, ...projects]);
          resetForm();
          return;
        }
      }
      // Mock creation fallback
      const mockProject = {
        _id: `mock-proj-${Date.now()}`,
        ...projectData,
        status: 'searching',
        owner: { name: user?.name || 'You', avatar: user?.avatar }
      };
      setProjects([mockProject, ...projects]);
      resetForm();
    } catch (err) {
      console.error('Failed to post project', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSkillsRequired('');
    setShowCreateModal(false);
  };

  const handleJoinProject = (project) => {
    alert(`Request sent to join "${project.title}"! The project owner will contact you at your email.`);
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            Welcome, <span className="gradient-text">{user?.name || 'Developer'}</span>!
          </h1>
          <p style={{ color: 'hsl(var(--muted))', marginTop: '4px' }}>
            Browse active project ideas or find collaborators.
          </p>
        </div>
        <button className="glow-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'hsl(var(--primary) / 0.15)', borderRadius: '12px', color: 'hsl(var(--primary))' }}>
            <FolderKanban size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', lineHeight: '1.2' }}>{projects.length}</h3>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted))' }}>Active Projects</p>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'hsl(var(--secondary) / 0.15)', borderRadius: '12px', color: 'hsl(var(--secondary))' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', lineHeight: '1.2' }}>12</h3>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted))' }}>Partner Matches</p>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'hsl(var(--accent) / 0.15)', borderRadius: '12px', color: 'hsl(var(--accent))' }}>
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', lineHeight: '1.2' }}>148</h3>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted))' }}>Platform Members</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        skillsFilter={skillsFilter}
        setSkillsFilter={setSkillsFilter}
        placeholder="Search projects by title, details..."
      />

      {/* Projects Grid */}
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>Open Projects</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'hsl(var(--muted))' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'hsl(var(--muted))' }}>
          No projects matched your search criteria. Create one to get started!
        </div>
      ) : (
        <div className="grid">
          {projects.map((project) => (
            <Card key={project._id} type="project" data={project} onAction={handleJoinProject} />
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Create New Project</h2>
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Code Companion"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your project idea and what you want to achieve..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Skills Required (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, LLMs"
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="theme-btn" style={{ padding: '10px 20px' }} onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="glow-btn">
                  <Send size={14} />
                  Post Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

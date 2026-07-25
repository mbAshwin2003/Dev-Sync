import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import { API_URL } from '../context/AuthContext';

const MOCK_DEVELOPERS = [
  {
    id: 'mock-dev-2',
    name: 'Sarah Connor',
    email: 'sarah@cyberdyne.io',
    bio: 'AI Safety Specialist and Rust developer. Passionate about machine learning ethics and deterministic compilation.',
    skills: ['Rust', 'Python', 'Docker', 'Machine Learning', 'C++'],
    github: 'https://github.com/sarahconnor',
    linkedin: 'https://linkedin.com/in/sarahconnor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'mock-dev-3',
    name: 'Vitalik Nakamoto',
    email: 'vitalik@ethereum.org',
    bio: 'Blockchain researcher and Solidity developer. Let\'s build the next generation of scalable dApps.',
    skills: ['Solidity', 'Go', 'Cryptography', 'React', 'TypeScript'],
    github: 'https://github.com/vitalik',
    linkedin: 'https://linkedin.com/in/vitalik',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'mock-dev-4',
    name: 'Marcus Miller',
    email: 'marcus@miller-iot.com',
    bio: 'Hardware geek turned Software engineer. Specializing in embedded systems and web interfaces.',
    skills: ['C++', 'Python', 'React', 'MQTT', 'Linux'],
    github: 'https://github.com/marcusmiller',
    linkedin: 'https://linkedin.com/in/marcusmiller',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

const FindPartners = () => {
  const [developers, setDevelopers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (skillsFilter) queryParams.append('skills', skillsFilter);

      const res = await fetch(`${API_URL}/developers?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length === 0 && !searchQuery && !skillsFilter) {
          setDevelopers(MOCK_DEVELOPERS);
        } else {
          setDevelopers(data);
        }
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.warn('Could not fetch developers from API, using mock state.');
      let filtered = [...MOCK_DEVELOPERS];
      if (searchQuery) {
        filtered = filtered.filter(dev => 
          dev.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          dev.bio.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (skillsFilter) {
        const filterArray = skillsFilter.split(',').map(s => s.trim().toLowerCase());
        filtered = filtered.filter(dev => 
          dev.skills.some(s => filterArray.includes(s.toLowerCase()))
        );
      }
      setDevelopers(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, [searchQuery, skillsFilter]);

  const handleConnect = (developer) => {
    alert(`Connecting with ${developer.name}! Invitation sent to their registered email: ${developer.email}`);
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          Find <span className="gradient-text">Partners</span>
        </h1>
        <p style={{ color: 'hsl(var(--muted))', marginTop: '4px' }}>
          Connect with talented developers whose skills complement your project requirements.
        </p>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        skillsFilter={skillsFilter}
        setSkillsFilter={setSkillsFilter}
        placeholder="Search developers by name, bio, tags..."
      />

      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>Available Collaborators</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'hsl(var(--muted))' }}>Loading profiles...</div>
      ) : developers.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'hsl(var(--muted))' }}>
          No developers found matching your criteria. Try refining your filters!
        </div>
      ) : (
        <div className="grid">
          {developers.map((dev) => (
            <Card key={dev.id || dev._id} type="developer" data={dev} onAction={handleConnect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindPartners;

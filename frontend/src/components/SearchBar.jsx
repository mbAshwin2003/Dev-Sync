import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, skillsFilter, setSkillsFilter, placeholder }) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted))' }} />
          <input
            type="text"
            placeholder={placeholder || "Search by title, bio, keyword..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '48px' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--muted))', fontSize: '0.9rem' }}>
          <SlidersHorizontal size={14} />
          <span>Filter by skills (comma-separated):</span>
        </div>
        <input
          type="text"
          placeholder="e.g. React, Node.js, Python"
          value={skillsFilter}
          onChange={(e) => setSkillsFilter(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
        />
      </div>
    </div>
  );
};

export default SearchBar;

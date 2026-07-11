import React from 'react';
import { Code, Github, Linkedin, MessageSquare, Plus } from 'lucide-react';

const Card = ({ type, data, onAction }) => {
  if (type === 'developer') {
    return (
      <div className="glass-panel dev-card">
        <div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <img
              src={data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
              alt={data.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid hsl(var(--primary))' }}
            />
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>{data.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted))' }}>{data.email}</p>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: '16px', minHeight: '40px' }}>
            {data.bio || 'No bio provided.'}
          </p>
        </div>

        <div>
          <div style={{ marginBottom: '16px' }}>
            {data.skills && data.skills.map((skill, idx) => (
              <span key={idx} className="badge">{skill}</span>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid hsl(var(--card-border))', paddingTop: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {data.github && (
                <a href={data.github} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--foreground))', opacity: 0.7 }} className="nav-link">
                  <Github size={18} />
                </a>
              )}
              {data.linkedin && (
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--foreground))', opacity: 0.7 }} className="nav-link">
                  <Linkedin size={18} />
                </a>
              )}
            </div>
            <button className="glow-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onAction && onAction(data)}>
              <MessageSquare size={14} />
              Connect
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Project Card
  return (
    <div className="glass-panel dev-card">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{data.title}</h3>
          <span className="badge" style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.7rem' }}>
            {data.status || 'searching'}
          </span>
        </div>
        <p style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: '16px', minHeight: '60px' }}>
          {data.description}
        </p>
      </div>

      <div>
        <div style={{ marginBottom: '16px' }}>
          {data.skillsRequired && data.skillsRequired.map((skill, idx) => (
            <span key={idx} className="badge" style={{ backgroundColor: 'hsl(var(--secondary) / 0.1)', color: 'hsl(var(--secondary))', borderColor: 'hsl(var(--secondary) / 0.2)' }}>{skill}</span>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid hsl(var(--card-border))', paddingTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted))' }}>Owner:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{data.owner?.name || 'Unknown'}</span>
          </div>
          <button className="glow-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onAction && onAction(data)}>
            <Plus size={14} />
            Join Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

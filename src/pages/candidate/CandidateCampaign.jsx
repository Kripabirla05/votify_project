import React, { useState } from 'react';
import { useAuth, useVoting } from '../../context/AppContext';
import { CampaignIcon, SparklesIcon, EditIcon, CheckCircleIcon, CandidateIcon } from '../../assets/icons';

export const CandidateCampaign = () => {
  const { user, addToast } = useAuth();
  const { candidates, updateCandidateCampaign } = useVoting();

  const currentCandidate = candidates.find(c => c.email === user?.email || c.name === user?.name);

  const [formData, setFormData] = useState({
    symbol: currentCandidate?.symbol || '🗳️',
    symbolName: currentCandidate?.symbolName || '',
    shortBio: currentCandidate?.shortBio || '',
    manifesto: currentCandidate?.manifesto || ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const symbolList = [
    { icon: '💻', name: 'Cyber Core' },
    { icon: '🚀', name: 'Rocket of Progress' },
    { icon: '⚡', name: 'Lightning Beacon' },
    { icon: '🛡️', name: 'Shield of Integrity' },
    { icon: '🎭', name: 'Golden Mask' },
    { icon: '🎸', name: 'Electric Guitar' },
    { icon: '🔬', name: 'Quantum Prism' },
    { icon: '🏆', name: 'Championship Cup' },
    { icon: '📚', name: 'Knowledge Torch' }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (currentCandidate) {
      updateCandidateCampaign(currentCandidate.id, formData);
    }
    setIsEditing(false);
    addToast('Campaign manifesto and symbol saved successfully!', 'success');
  };

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <CampaignIcon size={30} style={{ color: 'var(--primary)' }} />
            Campaign & Manifesto Studio
          </h1>
          <p>Craft your electoral manifesto, select your official symbol, and preview your voter ballot card.</p>
        </div>

        <div className="page-header-actions">
          {isEditing ? (
            <button type="button" className="btn btn-success" onClick={handleSave}>
              <CheckCircleIcon size={18} />
              Save Changes
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <EditIcon size={18} />
              Edit Campaign Info
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-grid-2col">
        {/* Editor Form */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Campaign Information</h3>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Election Symbol & Name</label>
              {isEditing ? (
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    {symbolList.map(s => (
                      <button
                        key={s.name}
                        type="button"
                        className={`btn btn-secondary ${formData.symbol === s.icon ? 'btn-primary' : ''}`}
                        style={{ fontSize: '1.25rem', padding: '0.4rem 0.8rem' }}
                        onClick={() => setFormData({ ...formData, symbol: s.icon, symbolName: s.name })}
                      >
                        {s.icon}
                      </button>
                    ))}
                  </div>
                  <input
                    className="form-input"
                    value={formData.symbolName}
                    onChange={(e) => setFormData({ ...formData, symbolName: e.target.value })}
                    placeholder="Symbol Title"
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '1.75rem' }}>{formData.symbol}</span>
                  <span style={{ fontWeight: 700 }}>{formData.symbolName}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Short Biography & Credentials</label>
              {isEditing ? (
                <input
                  className="form-input"
                  value={formData.shortBio}
                  onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                  placeholder="e.g. 3rd Year Computer Science | President of Robotics Club"
                />
              ) : (
                <p style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', margin: 0 }}>
                  {formData.shortBio}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Official Electoral Manifesto</label>
              {isEditing ? (
                <textarea
                  className="form-textarea"
                  rows="5"
                  value={formData.manifesto}
                  onChange={(e) => setFormData({ ...formData, manifesto: e.target.value })}
                  placeholder="Write your campaign roadmap, pledges, and vision for voters..."
                />
              ) : (
                <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{formData.manifesto}"
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Live Voter Ballot Preview */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <SparklesIcon size={20} />
              Live Voter Ballot Preview
            </h3>
            <span className="badge badge-info">How Voters See You</span>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
            <div className="candidate-card" style={{ background: 'var(--surface)', margin: 0 }}>
              <div className="candidate-card-top">
                <div className="candidate-avatar-wrapper">
                  <div className="candidate-img" aria-hidden="true">
                    <CandidateIcon size={28} />
                  </div>
                  <div className="candidate-symbol-badge">
                    {formData.symbol}
                  </div>
                </div>

                <div className="candidate-header-meta">
                  <h3>{user?.name || currentCandidate?.name}</h3>
                  <div className="candidate-category-tag">{currentCandidate?.category || 'Innovation & Technology Secretary'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Symbol: <strong>{formData.symbolName}</strong>
                  </div>
                </div>
              </div>

              <p className="candidate-bio">{formData.shortBio}</p>

              <div className="candidate-manifesto-box">
                "{formData.manifesto}"
              </div>

              <button type="button" className="btn btn-primary btn-sm" disabled style={{ width: '100%' }}>
                Vote Candidate (Voter View)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCampaign;

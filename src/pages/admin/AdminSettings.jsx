import React, { useState } from 'react';
import { useAuth } from '../../context/AppContext';
import { SettingsIcon } from '../../assets/icons';

export const AdminSettings = () => {
  const { addToast } = useAuth();
  const [settings, setSettings] = useState({
    systemName: 'Votify — Smart Online Voting System',
    electionSession: '2025-2026',
    requireKycApproval: true,
    allowCandidateSelfNomination: true,
    enableLivePublicResults: true,
    ballotReceiptPrinting: true,
    maxVotesPerVoterPerCategory: '1',
    autoCloseVotingDeadline: true
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    addToast('Configuration parameter updated.', 'info');
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    addToast('System settings persisted successfully!', 'success');
    setIsEditing(false);
  };

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <SettingsIcon size={30} style={{ color: 'var(--primary)' }} />
            System & Election Settings
          </h1>
          <p>Configure organisation governance policies, security tokens, and demo parameters.</p>
        </div>

        <div className="page-header-actions">
          {isEditing ? (
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </div>

      <div>
      
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Electoral System Rules</h3>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Organisation System Name</label>
              <input
                className="form-input"
                value={settings.systemName}
                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Election Year / Session</label>
              <input
                className="form-input"
                value={settings.electionSession}
                onChange={(e) => setSettings({ ...settings, electionSession: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: isEditing ? 'pointer' : 'default' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Enforce KYC Verification</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Require voter document match before allowing vote</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireKycApproval}
                  onChange={() => handleToggle('requireKycApproval')}
                  disabled={!isEditing}
                  style={{ width: '18px', height: '18px' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: isEditing ? 'pointer' : 'default' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Candidate Self-Nomination</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Allow registered candidates to apply for open categories</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowCandidateSelfNomination}
                  onChange={() => handleToggle('allowCandidateSelfNomination')}
                  disabled={!isEditing}
                  style={{ width: '18px', height: '18px' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: isEditing ? 'pointer' : 'default' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Public Live Turnout Board</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Display real-time tallies to voters and candidates</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableLivePublicResults}
                  onChange={() => handleToggle('enableLivePublicResults')}
                  disabled={!isEditing}
                  style={{ width: '18px', height: '18px' }}
                />
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

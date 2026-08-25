import React from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/UI';
import { useAuth, useVoting } from '../../context/AppContext';
import {
  CandidateIcon,
  VoteIcon,
  CampaignIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ApplyIcon
} from '../../assets/icons';

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const { candidates, categories } = useVoting();

  const candidateData = candidates.find(c => c.email === user?.email || c.name === user?.name) || {
    name: user?.name || 'Candidate',
    category: user?.category || 'No category applied for yet',
    status: user?.applicationStatus || 'Not Applied',
    votes: 0,
    symbol: '🗳️',
    manifesto: '',
    shortBio: '',
  };

  const categoryInfo = categories.find(c => c.name === candidateData.category);

  
  const applied = Boolean(candidateData.appliedDate);
  const reviewStep = {
    Approved: { icon: '✓', title: 'Board Review Approved', body: 'Candidate verified and published to the ballot' },
    Rejected: { icon: '✕', title: 'Board Review Rejected', body: candidateData.rejectionReason || 'The election board did not accept this nomination' },
  }[candidateData.status] || { icon: '⏳', title: 'Board Review Pending', body: 'Waiting on an admin decision for this nomination' };

  const votingOpen = categoryInfo?.status === 'Active';
  const milestones = [
    {
      icon: applied ? '✓' : '⏳',
      title: 'Nomination Form Submitted',
      stamp: candidateData.appliedDate || 'Not yet',
      body: applied ? 'Registration details logged on the roll' : 'Apply to a category to start your candidacy',
    },
    {
      ...reviewStep,
      stamp: candidateData.status === 'Pending' ? 'In review' : candidateData.status,
    },
    {
      icon: votingOpen ? '⚡' : '🕒',
      title: votingOpen ? 'Voting Window Open' : 'Voting Window Not Open',
      stamp: categoryInfo?.status || '—',
      body: votingOpen
        ? 'Ballots actively accepted from verified voters'
        : 'Ballots open when the admin marks this category active',
    },
  ];
  const totalCatVotes = categoryInfo?.totalVotes || 0;
  const voteShare = totalCatVotes > 0 ? Math.round(((candidateData.votes || 0) / totalCatVotes) * 100) : 0;

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <CandidateIcon size={30} style={{ color: 'var(--primary)' }} />
            Candidate Campaign Command Center
          </h1>
          <p>Monitor your candidacy verification status, ballot share, manifesto outreach, and rankings.</p>
        </div>

        <div className="page-header-actions">
          <Link to="/candidate/campaign" className="btn btn-primary">
            <CampaignIcon size={18} />
            Edit Campaign & Manifesto
          </Link>
        </div>
      </div>

      
      <div
        className="dashboard-panel"
        style={{
          background: candidateData.status === 'Approved'
            ? 'linear-gradient(135deg, var(--surface), rgba(16, 185, 129, 0.08))'
            : candidateData.status === 'Rejected'
            ? 'linear-gradient(135deg, var(--surface), rgba(239, 68, 68, 0.08))'
            : 'linear-gradient(135deg, var(--surface), rgba(245, 158, 11, 0.08))',
          border: candidateData.status === 'Approved'
            ? '2px solid rgba(16, 185, 129, 0.4)'
            : candidateData.status === 'Rejected'
            ? '2px solid rgba(239, 68, 68, 0.4)'
            : '2px solid rgba(245, 158, 11, 0.4)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {candidateData.symbol || '🗳️'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.4rem' }}>{candidateData.name}</h2>
                <StatusBadge status={candidateData.status} />
              </div>
              <p style={{ marginTop: '0.2rem' }}>
                Nominated for: <strong style={{ color: 'var(--primary)' }}>{candidateData.category}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/candidate/votes" className="btn btn-secondary btn-sm">
              <VoteIcon size={16} /> Live Ballots
            </Link>
            <Link to="/candidate/apply" className="btn btn-outline btn-sm">
              <ApplyIcon size={16} /> Other Posts
            </Link>
          </div>
        </div>

        {candidateData.status === 'Pending' && (
          <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'var(--warning-light)', color: 'var(--warning)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            ⏳ Your application has been logged and is under compliance verification by the Election Board.
          </div>
        )}

        {candidateData.status === 'Rejected' && (
          <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            ❌ Application rejected. Reason: {candidateData.rejectionReason || 'Prerequisite guidelines not fulfilled.'}
          </div>
        )}
      </div>

      
      <div className="stats-grid">
        <StatCard
          label="My Ballot Tally"
          value={candidateData.votes || 0}
          subtext="Verified voter ballots"
          icon={VoteIcon}
          iconTheme="primary"
        />
        <StatCard
          label="Current Standing"
          value="#1"
          subtext="Leader in category"
          icon={TrophyIcon}
          iconTheme="warning"
        />
        <StatCard
          label="Category Vote Share"
          value={`${voteShare}%`}
          subtext={`Of ${totalCatVotes} total cast`}
          icon={ShieldCheckIcon}
          iconTheme="accent"
        />
        <StatCard
          label="Profile Completion"
          value="95%"
          subtext="Manifesto & Symbol Active"
          icon={CampaignIcon}
          iconTheme="success"
        />
      </div>

      
      <div className="dashboard-grid-2col">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Published Manifesto Pledges</h3>
            <Link to="/candidate/campaign" className="btn btn-secondary btn-sm">Edit</Link>
          </div>
          <p style={{ fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-primary)', background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            "{candidateData.manifesto}"
          </p>
          <div style={{ marginTop: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Candidate Bio</span>
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>{candidateData.shortBio}</p>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Election Timeline Milestones</h3>
          </div>
          <div className="activity-feed-list">
            {milestones.map((step) => (
              <div key={step.title} className="activity-feed-item">
                <div className="activity-icon-bullet">{step.icon}</div>
                <div className="activity-feed-content">
                  <div className="activity-header-line">
                    <span>{step.title}</span>
                    <span className="activity-time-stamp">{step.stamp}</span>
                  </div>
                  <div className="activity-body-text">{step.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;

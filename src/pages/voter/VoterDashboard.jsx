import React from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/UI';
import { useAuth, useVoting } from '../../context/AppContext';
import {
  VoteIcon,
  CategoryIcon,
  HistoryIcon,
  ShieldCheckIcon,
  BellIcon,
  SparklesIcon
} from '../../assets/icons';

export const VoterDashboard = () => {
  const { user } = useAuth();
  const { categories, voterHistory, announcements } = useVoting();

  const activeCategories = categories.filter(c => c.status === 'Active');
  const upcomingCategories = categories.filter(c => c.status === 'Upcoming');
  const votedCount = voterHistory.length;
  const pendingBallots = Math.max(0, activeCategories.length - votedCount);

  return (
    <div>
      {/* Welcome Card Banner */}
      <div
        className="dashboard-panel"
        style={{
          background: 'linear-gradient(135deg, rgba(212, 162, 76, 0.2), rgba(47, 107, 79, 0.08))',
          border: '1px solid var(--primary-glow)',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            {user?.voterId && (
              <div style={{ marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Voter ID: {user.voterId}
              </div>
            )}
            <h1 style={{ fontSize: '1.95rem', fontWeight: 800 }}>
              Welcome back, {user?.name || 'Voter'}!
            </h1>
            <p style={{ marginTop: '0.25rem', fontSize: '0.95rem' }}>
              Your democratic voice shapes the leadership. You have <strong>{pendingBallots} active ballots</strong> awaiting your vote.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/voter/categories" className="btn btn-primary btn-lg">
              <VoteIcon size={18} />
              Cast Open Ballots
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard
          label="Active Elections"
          value={activeCategories.length}
          subtext="Contested posts"
          icon={CategoryIcon}
          iconTheme="primary"
        />
        <StatCard
          label="Ballots Cast"
          value={votedCount}
          subtext="Verified & receipted"
          icon={VoteIcon}
          iconTheme="success"
        />
        <StatCard
          label="Pending Ballots"
          value={pendingBallots}
          subtext="Requires your vote"
          icon={ShieldCheckIcon}
          iconTheme="warning"
        />
        <StatCard
          label="Upcoming Elections"
          value={upcomingCategories.length}
          subtext="Scheduled next month"
          icon={SparklesIcon}
          iconTheme="accent"
        />
      </div>

      {/* Grid of Content: Active Elections Carousel & Reminders / Announcements */}
      <div className="dashboard-grid-2col">
        {/* Active Elections Box */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">
                <VoteIcon size={20} />
                Live Election Ballots
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click into any active election to review candidates and cast your vote.</p>
            </div>
            <Link to="/voter/categories" className="btn btn-secondary btn-sm">View All</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeCategories.slice(0, 3).map((cat) => {
              const hasVoted = voterHistory.some(h => h.category === cat.name);
              return (
                <div
                  key={cat.id}
                  style={{
                    padding: '1rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', margin: 0 }}>{cat.name}</h4>
                      <StatusBadge status={cat.status} />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {cat.candidatesCount} Candidates Registered • {cat.totalVotes} Total Votes
                    </p>
                  </div>

                  {hasVoted ? (
                    <span className="badge badge-success">✓ Voted</span>
                  ) : (
                    <Link to="/voter/categories" className="btn btn-primary btn-sm">
                      Vote Now
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Voting Reminders & Announcements */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <BellIcon size={20} />
              Election Reminders & Notices
            </h3>
          </div>

          <div className="activity-feed-list">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="activity-feed-item">
                <div className="activity-icon-bullet">📢</div>
                <div className="activity-feed-content">
                  <div className="activity-header-line">
                    <span>{ann.title}</span>
                    <span className="activity-time-stamp">{ann.date}</span>
                  </div>
                  <div className="activity-body-text">{ann.content}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <Link to="/voter/history" className="btn btn-outline" style={{ width: '100%' }}>
              <HistoryIcon size={16} />
              Inspect My Voting History & Receipts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;

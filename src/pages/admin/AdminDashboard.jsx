import React from 'react';
import { Link } from 'react-router-dom';
import { StatCard, ChartCard } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/UI';
import { useVoting } from '../../context/AppContext';
import {
  UsersIcon,
  CandidateIcon,
  CategoryIcon,
  VoteIcon,
  ResultsIcon,
  ActivityIcon,
  PlusIcon,
  ShieldCheckIcon
} from '../../assets/icons';

export const AdminDashboard = () => {
  const { categories, candidates, voters, activityLogs } = useVoting();

  const totalVoters = voters.length;
  const totalCandidates = candidates.length;
  const totalCategories = categories.length;
  const totalVotesCast = categories.reduce((sum, c) => sum + (c.totalVotes || 0), 0);
  const turnoutPercent = Math.round((voters.filter(v => v.votingStatus === 'Voted').length / (voters.length || 1)) * 100);

  // Voter registry split, derived from the roll itself so an empty registry
  // renders an empty ring rather than invented percentages.
  const kycShare = (status) => (
    voters.length ? Math.round((voters.filter(v => v.kycStatus === status).length / voters.length) * 100) : 0
  );
  const verifiedPct = kycShare('Verified');
  const pendingPct = kycShare('Pending');
  const blockedPct = kycShare('Blocked');

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <ShieldCheckIcon size={30} style={{ color: 'var(--primary)' }} />
            Election Administration Portal
          </h1>
          <p>Real-time electoral monitoring, identity governance, and ballot auditing.</p>
        </div>

        <div className="page-header-actions">
          <Link to="/admin/categories" className="btn btn-primary">
            <PlusIcon size={18} />
            Create Category
          </Link>
          <Link to="/admin/results" className="btn btn-secondary">
            <ResultsIcon size={18} />
            View Live Results
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total Voters"
          value={totalVoters}
          subtext="Registered voters"
          icon={UsersIcon}
          iconTheme="primary"
        />
        <StatCard
          label="Total Candidates"
          value={totalCandidates}
          subtext={`${candidates.filter(c => c.status === 'Approved').length} Approved`}
          icon={CandidateIcon}
          iconTheme="accent"
        />
        <StatCard
          label="Active Categories"
          value={totalCategories}
          subtext="Contested roles"
          icon={CategoryIcon}
          iconTheme="warning"
        />
        <StatCard
          label="Votes Cast Today"
          value={totalVotesCast}
          subtext="Across all races"
          icon={VoteIcon}
          iconTheme="success"
        />
        <StatCard
          label="Live Turnout"
          value={`${turnoutPercent}%`}
          subtext="Active participation"
          icon={ActivityIcon}
          iconTheme="primary"
        />
      </div>

      {/* Analytics & Charts Breakdown */}
      <div className="dashboard-grid-2col">
        {/* Category Turnout Bars */}
        <ChartCard
          title="Turnout by Election Category"
          subtitle="Real-time ballot volume per contested post"
          action={<Link to="/admin/categories" className="btn btn-outline btn-sm">View All</Link>}
        >
          <div className="css-chart-bar-container">
            {categories.map((cat) => {
              const maxVotes = 1000;
              const pct = Math.min(100, Math.round(((cat.totalVotes || 0) / maxVotes) * 100));
              return (
                <div key={cat.id} className="bar-chart-row">
                  <div className="bar-row-info">
                    <span>{cat.name}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {cat.totalVotes || 0} votes ({pct}%)
                    </span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${Math.max(5, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Voter KYC Status Donut Simulation */}
        <ChartCard
          title="Voter Registry Status"
          subtitle="Verification & eligibility ratio"
          action={<Link to="/admin/voters" className="btn btn-outline btn-sm">Manage</Link>}
        >
          <div className="donut-stat-wrapper">
            <svg width="140" height="140" viewBox="0 0 42 42" className="donut-chart-svg">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--bg-subtle)" strokeWidth="4" />
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke="var(--success)"
                strokeWidth="4"
                strokeDasharray={`${verifiedPct} ${100 - verifiedPct}`}
                strokeDashoffset="25"
              />
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke="var(--warning)"
                strokeWidth="4"
                strokeDasharray={`${pendingPct} ${100 - pendingPct}`}
                strokeDashoffset={25 - verifiedPct}
              />
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke="var(--danger)"
                strokeWidth="4"
                strokeDasharray={`${blockedPct} ${100 - blockedPct}`}
                strokeDashoffset={25 - verifiedPct - pendingPct}
              />
            </svg>

            <div className="donut-legend">
              <div className="donut-legend-item">
                <span className="legend-color-dot" style={{ backgroundColor: 'var(--success)' }} />
                <span>Verified ({verifiedPct}%)</span>
              </div>
              <div className="donut-legend-item">
                <span className="legend-color-dot" style={{ backgroundColor: 'var(--warning)' }} />
                <span>Pending KYC ({pendingPct}%)</span>
              </div>
              <div className="donut-legend-item">
                <span className="legend-color-dot" style={{ backgroundColor: 'var(--danger)' }} />
                <span>Blocked / Flagged ({blockedPct}%)</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity Table */}
      <div className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <ActivityIcon size={20} />
              Recent Electoral Activity Trail
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cryptographic timestamps of voter and admin actions</p>
          </div>
          <Link to="/admin/activity-logs" className="btn btn-secondary btn-sm">Full Audit Trail</Link>
        </div>

        <div className="table-responsive-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Actor</th>
                <th>Details</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.slice(0, 5).map((log) => (
                <tr key={log.id}>
                  <td><strong>{log.action}</strong></td>
                  <td>{log.user}</td>
                  <td>{log.details}</td>
                  <td><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.timestamp}</span></td>
                  <td>
                    <StatusBadge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

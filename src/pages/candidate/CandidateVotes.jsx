import React from 'react';
import { StatCard, ChartCard } from '../../components/common/Cards';
import { useAuth, useVoting } from '../../context/AppContext';
import { VoteIcon, TrophyIcon, UsersIcon, ShieldCheckIcon } from '../../assets/icons';

export const CandidateVotes = () => {
  const { user } = useAuth();
  const { candidates, categories } = useVoting();

  const candidate = candidates.find(c => c.email === user?.email || c.name === user?.name);
  const categoryInfo = categories.find(c => c.name === candidate?.category);

  const totalCatVotes = categoryInfo?.totalVotes || 0;
  const myVotes = candidate?.votes || 0;
  const votePercentage = totalCatVotes > 0 ? Math.round((myVotes / totalCatVotes) * 100) : 0;

  const competitors = candidates
    .filter(c => c.category === candidate?.category && c.status === 'Approved')
    .sort((a, b) => (b.votes || 0) - (a.votes || 0));

  const myRank = competitors.findIndex(c => c.id === candidate?.id) + 1 || 1;

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <VoteIcon size={30} style={{ color: 'var(--primary)' }} />
            My Live Vote Count & Standing
          </h1>
          <p>
            {candidate
              ? <>Real-time tabulation metrics for candidate <strong>{candidate.name}</strong>.</>
              : 'Your standing will appear here once your candidacy is approved.'}
          </p>
        </div>

        <div className="page-header-actions">
          <span className="badge badge-info" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            ⚡ Frontend Simulated Live Ledger
          </span>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div style={{ background: 'var(--primary-light)', border: '1px solid var(--primary-glow)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', fontSize: '0.875rem', color: 'var(--primary)' }}>
        ℹ️ <strong>Live Tally:</strong> Vote counts and percent shares update reactively across the entire application the moment any voter casts a ballot.
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          label="My Votes"
          value={myVotes}
          subtext="Direct ballots cast"
          icon={VoteIcon}
          iconTheme="primary"
        />
        <StatCard
          label="Current Position"
          value={`#${myRank}`}
          subtext={myRank === 1 ? 'Leading candidate' : 'Challenger standing'}
          icon={TrophyIcon}
          iconTheme="warning"
        />
        <StatCard
          label="Vote Percentage"
          value={`${votePercentage}%`}
          subtext="Share of category total"
          icon={ShieldCheckIcon}
          iconTheme="accent"
        />
        <StatCard
          label="Total Category Votes"
          value={totalCatVotes}
          subtext={`In ${candidate?.category || 'General'}`}
          icon={UsersIcon}
          iconTheme="success"
        />
      </div>

      {/* Competitors & Progress Bar Breakdown */}
      <div className="dashboard-grid-2col">
        <ChartCard
          title="Contestant Vote Distribution"
          subtitle={`Race breakdown for ${candidate?.category}`}
        >
          <div className="css-chart-bar-container">
            {competitors.map((comp, idx) => {
              const pct = totalCatVotes > 0 ? Math.round(((comp.votes || 0) / totalCatVotes) * 100) : 0;
              const isMe = comp.id === candidate?.id;

              return (
                <div key={comp.id} className="bar-chart-row" style={isMe ? { background: 'var(--bg-subtle)', padding: '0.5rem', borderRadius: 'var(--radius-md)' } : {}}>
                  <div className="bar-row-info">
                    <span>
                      {comp.symbol} {comp.name} {isMe && <strong>(YOU)</strong>}
                    </span>
                    <span style={{ color: isMe ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 700 }}>
                      {comp.votes || 0} votes ({pct}%)
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${Math.max(5, pct)}%`,
                        background: isMe
                          ? 'linear-gradient(90deg, var(--primary), var(--accent))'
                          : 'linear-gradient(90deg, #94a3b8, #cbd5e1)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Voting Integrity Card */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Ballot Audit Certificate</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div className="receipt-row">
              <span className="receipt-label">Contesting Category</span>
              <span className="receipt-value">{candidate?.category}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Candidate Identifier</span>
              <span className="receipt-value" style={{ fontFamily: 'var(--font-mono)' }}>{candidate?.id}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Nomination Status</span>
              <span className="receipt-value" style={{ color: 'var(--success)', fontWeight: 700 }}>
                {candidate?.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateVotes;

import React, { useState } from 'react';
import { StatCard, ChartCard } from '../../components/common/Cards';
import { useVoting } from '../../context/AppContext';
import { ResultsIcon, TrophyIcon, VoteIcon, UsersIcon, ActivityIcon, CandidateIcon } from '../../assets/icons';

export const AdminResults = () => {
  const { categories, candidates, voters } = useVoting();
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || null);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];
  const categoryCandidates = candidates
    .filter(c => c.category === selectedCategory?.name && c.status === 'Approved')
    .sort((a, b) => (b.votes || 0) - (a.votes || 0));

  const totalVotesCast = categories.reduce((acc, c) => acc + (c.totalVotes || 0), 0);
  const totalEligible = voters.length;
  const votedCount = voters.filter(v => v.votingStatus === 'Voted').length;
  const turnoutPercent = totalEligible ? Math.round((votedCount / totalEligible) * 100) : 0;

  const leadingCandidate = [...candidates]
    .filter(c => c.status === 'Approved')
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))[0];

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <ResultsIcon size={30} style={{ color: 'var(--primary)' }} />
            Election Results & Real-Time Tally
          </h1>
          <p>Live vote tabulation, candidate rankings, winner determinations, and turnout percentages.</p>
        </div>
      </div>

      {/* Analytics Highlights */}
      <div className="stats-grid">
        <StatCard
          label="Total Votes Tabulated"
          value={totalVotesCast}
          subtext="Cryptographically sealed ballots"
          icon={VoteIcon}
          iconTheme="primary"
        />
        <StatCard
          label="Electoral Turnout"
          value={`${turnoutPercent}%`}
          subtext={`${votedCount} of ${totalEligible} registered voters`}
          icon={ActivityIcon}
          iconTheme="success"
        />
        <StatCard
          label="Active Elections"
          value={categories.filter(c => c.status === 'Active').length}
          subtext="Contested posts in progress"
          icon={ResultsIcon}
          iconTheme="warning"
        />
        <StatCard
          label="Leading Candidate"
          value={leadingCandidate ? leadingCandidate.name.split(' ')[0] : 'None'}
          subtext={leadingCandidate ? `${leadingCandidate.votes} votes (${leadingCandidate.category})` : 'Awaiting ballots'}
          icon={TrophyIcon}
          iconTheme="accent"
        />
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`btn btn-sm ${selectedCategory?.id === cat.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategoryId(cat.id)}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results Breakdown Grid */}
      <div className="dashboard-grid-2col">
        {/* Candidate Ranking Cards */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">
                <TrophyIcon size={20} />
                {selectedCategory ? `${selectedCategory.name} — Live Standings` : 'Live Standings'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Category Ballots: {selectedCategory?.totalVotes || 0}
              </p>
            </div>
          </div>

          {categoryCandidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              {selectedCategory
                ? 'No approved candidates contesting in this category.'
                : 'No election categories have been created yet.'}
            </div>
          ) : (
            categoryCandidates.map((cand, idx) => {
              const isWinner = idx === 0 && (cand.votes || 0) > 0;
              const votePct = selectedCategory?.totalVotes
                ? Math.round(((cand.votes || 0) / selectedCategory.totalVotes) * 100)
                : 0;

              return (
                <div
                  key={cand.id}
                  className={`results-rank-card ${isWinner ? 'winner-card' : ''}`}
                >
                  {isWinner && (
                    <div className="winner-badge-pill">
                      🏆 WINNER / LEADING
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="rank-number">#{idx + 1}</div>
                    <div
                      aria-hidden="true"
                      style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      <CandidateIcon size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', margin: 0 }}>
                        {cand.name} {cand.symbol && <span>({cand.symbol})</span>}
                      </h4>
                      <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>
                        {cand.shortBio || cand.manifesto?.substring(0, 45)}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {cand.votes || 0} <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>votes</small>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isWinner ? 'var(--warning)' : 'var(--primary)' }}>
                      {votePct}% Share
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Visual Charts Card */}
        <ChartCard
          title="Vote Distribution Visualizer"
          subtitle={selectedCategory
            ? `Interactive percentage split for ${selectedCategory.name}`
            : 'Interactive percentage split, once a category has candidates'}
        >
          <div className="css-chart-bar-container">
            {categoryCandidates.map((cand, idx) => {
              const votePct = selectedCategory?.totalVotes
                ? Math.round(((cand.votes || 0) / selectedCategory.totalVotes) * 100)
                : 0;

              return (
                <div key={cand.id} className="bar-chart-row">
                  <div className="bar-row-info">
                    <span>{cand.symbol} {cand.name}</span>
                    <span style={{ color: idx === 0 ? 'var(--warning)' : 'var(--primary)', fontWeight: 700 }}>
                      {cand.votes || 0} votes ({votePct}%)
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${Math.max(4, votePct)}%`,
                        background: idx === 0
                          ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                          : 'linear-gradient(90deg, var(--primary), var(--accent))'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '1.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            🔒 Every counted ballot carries a numbered receipt. Results are sealed and update live as voters submit ballots.
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminResults;

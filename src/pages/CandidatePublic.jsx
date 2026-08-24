import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StatusBadge } from '../components/common/UI';
import { useVoting } from '../context/AppContext';
import { ChevronLeftIcon, TrophyIcon, ShieldCheckIcon, VoteIcon, CandidateIcon } from '../assets/icons';

/*
 * CandidatePublic
 * ----------------
 * A dynamic route (/candidates/:candidateId) that shows one candidate's
 * full public profile. Demonstrates useParams()/route params, plus
 * useMemo to avoid re-scanning the candidates list on every render.
 */
const candidatePublicCss = `
.candidate-public-page {
  min-height: 100vh;
  background: var(--bg-main);
  padding: 2.5rem 1.5rem 4rem;
}

.candidate-public-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 1.5rem;
}
.candidate-public-back:hover { color: var(--primary); }

.candidate-public-card {
  max-width: 720px;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.candidate-public-head {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.candidate-public-avatar {
  width: 88px;
  height: 88px;
  border-radius: 9999px;
  border: 3px solid var(--surface-elevated);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-subtle);
  color: var(--primary);
  flex-shrink: 0;
}

.candidate-public-symbol {
  font-size: 1.4rem;
}

.candidate-public-section {
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.candidate-public-section h2 {
  font-size: 0.95rem;
  margin-bottom: 0.6rem;
}

.candidate-public-manifesto {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  font-style: italic;
}

.candidate-public-stat-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.candidate-public-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
`;

export const CandidatePublic = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { candidates, categories } = useVoting();

  // useMemo: only re-scan the candidates/categories arrays when the
  // route param or the underlying data actually changes.
  const candidate = useMemo(
    () => candidates.find((c) => c.id === candidateId),
    [candidates, candidateId]
  );

  const categoryInfo = useMemo(
    () => categories.find((c) => c.name === candidate?.category),
    [categories, candidate]
  );

  return (
    <div className="candidate-public-page">
      <style>{candidatePublicCss}</style>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <button type="button" className="candidate-public-back" onClick={() => navigate(-1)}>
          <ChevronLeftIcon size={16} /> Back
        </button>
      </div>

      {!candidate ? (
        <div className="candidate-public-card" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Candidate Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            This candidate profile doesn't exist, or the link (<code>/candidates/{candidateId}</code>) is out of date.
          </p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      ) : (
        <article className="candidate-public-card">
          <div className="candidate-public-head">
            <div className="candidate-public-avatar" aria-hidden="true">
              <CandidateIcon size={36} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{candidate.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span className="candidate-category-tag">{candidate.category}</span>
                <StatusBadge status={candidate.status} />
              </div>
            </div>
            {candidate.symbol && (
              <div className="candidate-public-symbol" title={candidate.symbolName}>
                {candidate.symbol}
              </div>
            )}
          </div>

          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {candidate.shortBio}
          </p>

          {candidate.manifesto && (
            <section className="candidate-public-section">
              <h2>Manifesto</h2>
              <p className="candidate-public-manifesto">"{candidate.manifesto}"</p>
            </section>
          )}

          {candidate.rejectionReason && candidate.status === 'Rejected' && (
            <section className="candidate-public-section">
              <h2>Admin Note</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>{candidate.rejectionReason}</p>
            </section>
          )}

          <section className="candidate-public-section">
            <h2>Election Snapshot</h2>
            <div className="candidate-public-stat-row">
              <span className="candidate-public-stat">
                <VoteIcon size={16} /> {candidate.votes ?? 0} votes recorded
              </span>
              {categoryInfo && (
                <span className="candidate-public-stat">
                  <TrophyIcon size={16} /> {categoryInfo.candidatesCount} candidates in this category
                </span>
              )}
              <span className="candidate-public-stat">
                <ShieldCheckIcon size={16} /> Applied {candidate.appliedDate}
              </span>
            </div>
          </section>
        </article>
      )}
    </div>
  );
};

export default CandidatePublic;

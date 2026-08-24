import React from 'react';
import { StatusBadge, CountdownTimer } from './UI';
import { EyeIcon, CheckCircleIcon, XCircleIcon, CandidateIcon, VoteIcon, UsersIcon } from '../../assets/icons';
import { calculateAge, formatDob } from '../../utils/age';

export const CandidateCard = ({
  candidate,
  onView,
  onApprove,
  onReject,
  role = "admin"
}) => {
  const age = calculateAge(candidate.dob);

  return (
    <div className="candidate-card">
      <div className="candidate-card-top">
        <div className="candidate-avatar-wrapper">
          <div className="candidate-img" aria-hidden="true">
            <CandidateIcon size={28} />
          </div>
          {candidate.symbol && (
            <div className="candidate-symbol-badge" title={candidate.symbolName || 'Election Symbol'}>
              {candidate.symbol}
            </div>
          )}
        </div>

        <div className="candidate-header-meta">
          <h3>{candidate.name}</h3>
          <div className="candidate-category-tag">{candidate.category}</div>
          <div style={{ marginTop: '0.35rem' }}>
            <StatusBadge status={candidate.status} />
          </div>
          {candidate.dob && (
            <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              DOB {formatDob(candidate.dob)}{age !== null ? ` · Age ${age}` : ''}
            </div>
          )}
        </div>
      </div>

      <p className="candidate-bio">{candidate.shortBio}</p>

      {candidate.manifesto && (
        <div className="candidate-manifesto-box">
          "{candidate.manifesto}"
        </div>
      )}

      {candidate.rejectionReason && candidate.status === 'Rejected' && (
        <div style={{ padding: '0.6rem 0.8rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', marginBottom: '1rem' }}>
          <strong>Reason:</strong> {candidate.rejectionReason}
        </div>
      )}

      <div className="candidate-card-actions">
        {onView && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
            onClick={() => onView(candidate)}
          >
            <EyeIcon size={14} />
            View
          </button>
        )}

        {role === 'admin' && candidate.status === 'Pending' && (
          <>
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => onApprove(candidate.id)}
            >
              <CheckCircleIcon size={14} />
              Approve
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => onReject(candidate)}
            >
              <XCircleIcon size={14} />
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const CategoryCard = ({
  category,
  onVote,
  onApply,
  onEdit,
  onDelete,
  role = "voter",
  hasVoted = false
}) => {
  return (
    <div className="category-card">
      <div>
        <div className="category-card-header">
          <h3 className="category-title">{category.name}</h3>
          <StatusBadge status={category.status} />
        </div>

        <p className="category-description">{category.description}</p>

        <div className="category-meta-grid">
          <div className="category-meta-item">
            <span className="meta-label">Candidates</span>
            <span className="meta-val" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CandidateIcon size={14} />
              {category.candidatesCount || 0} Registered
            </span>
          </div>
          <div className="category-meta-item">
            <span className="meta-label">Votes Cast</span>
            <span className="meta-val" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UsersIcon size={14} />
              {category.totalVotes || 0}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {category.status === 'Active' ? 'Time Remaining:' : 'Registration Period:'}
          </span>
          {category.status === 'Active' && <CountdownTimer targetDate={category.endDate} />}
        </div>
      </div>

      <div className="category-card-footer">
        {role === 'voter' && (
          hasVoted ? (
            <button type="button" className="btn btn-outline btn-sm" disabled style={{ width: '100%' }}>
              ✓ Ballot Cast
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
              onClick={() => onVote(category)}
              disabled={category.status !== 'Active'}
            >
              <VoteIcon size={16} />
              Vote Now
            </button>
          )
        )}

        {role === 'candidate' && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
            onClick={() => onApply(category)}
            disabled={category.status !== 'Active' && category.status !== 'Upcoming'}
          >
            Apply for Candidacy
          </button>
        )}

        {role === 'admin' && (
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              onClick={() => onEdit(category)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
              onClick={() => onDelete(category.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ChartCard = ({ title, subtitle, children, action, className = "" }) => {
  return (
    <div className={`dashboard-panel ${className}`}>
      <div className="panel-header">
        <div>
          <h3 className="panel-title">{title}</h3>
          {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="panel-body">
        {children}
      </div>
    </div>
  );
};

export const StatCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconTheme = "primary",
  trend,
  className = ""
}) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card-info">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{value}</span>
        {subtext && (
          <span className="stat-card-subtext">
            {trend && (
              <span style={{ color: trend > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
            )}
            {subtext}
          </span>
        )}
      </div>
      {Icon && (
        <div className={`stat-card-icon-box icon-box-${iconTheme}`}>
          <Icon size={26} />
        </div>
      )}
    </div>
  );
};

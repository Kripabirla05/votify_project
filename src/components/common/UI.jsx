import React from 'react';
import { SparklesIcon } from '../../assets/icons';
import { useCountdown, useScrollReveal } from '../../hooks/hooks';

export const StatusBadge = ({ status, className = "" }) => {
  if (!status) return null;

  const normalized = status.toLowerCase().replace(/\s+/g, '-');

  return (
    <span className={`badge badge-${normalized} ${className}`}>
      <span className="badge-dot" />
      {status}
    </span>
  );
};

export const CountdownTimer = ({ targetDate = "2026-08-25T18:00:00" }) => {
  const timeLeft = useCountdown(targetDate);

  return (
    <div className="countdown-container" title={`Election closes: ${targetDate}`}>
      <div className="countdown-box">
        <span className="num">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="lbl">d</span>
      </div>
      <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>:</span>
      <div className="countdown-box">
        <span className="num">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="lbl">h</span>
      </div>
      <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>:</span>
      <div className="countdown-box">
        <span className="num">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="lbl">m</span>
      </div>
      <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>:</span>
      <div className="countdown-box">
        <span className="num">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="lbl">s</span>
      </div>
    </div>
  );
};

export const EmptyState = ({
  icon: Icon = SparklesIcon,
  title = "No records found",
  description = "There are no items to display at this moment.",
  actionText,
  onAction,
  className = ""
}) => {
  return (
    <div
      className={`empty-state-box ${className}`}
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        background: 'var(--surface)',
        border: '1px dashed var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        margin: '1.5rem 0'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-subtle)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button type="button" className="btn btn-primary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};


export const Reveal = ({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

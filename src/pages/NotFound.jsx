import React from 'react';
import { Link } from 'react-router-dom';
import { VoteIcon } from '../assets/icons';

export const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: 'var(--bg-main)'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <VoteIcon size={36} />
      </div>

      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0 1rem 0' }}>
        Electoral Route Not Found
      </h2>
      <p style={{ maxWidth: '420px', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        The requested page could not be located in the Votify ledger. Please check the URL or return to home.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/login" className="btn btn-primary">
          Back to Authentication
        </Link>
        <Link to="/voter/dashboard" className="btn btn-secondary">
          Go to Voter Portal
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

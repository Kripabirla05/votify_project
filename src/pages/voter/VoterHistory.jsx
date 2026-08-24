import React, { useState } from 'react';
import { SearchBar } from '../../components/common/FormFields';
import { StatusBadge, EmptyState } from '../../components/common/UI';
import { useVoting } from '../../context/AppContext';
import { HistoryIcon } from '../../assets/icons';

export const VoterHistory = () => {
  const { voterHistory } = useVoting();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = voterHistory.filter(h =>
    h.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.receiptId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <HistoryIcon size={30} style={{ color: 'var(--primary)' }} />
            My Voting History & Ballots
          </h1>
          <p>Cryptographic receipts and timestamped confirmation for all ballots you have cast.</p>
        </div>
      </div>

      <div className="filter-toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by category, candidate, or ballot number..."
          style={{ width: '340px' }}
        />
      </div>

      {filteredHistory.length === 0 ? (
        <EmptyState
          title="No Voting History Yet"
          description="You haven't submitted any ballots in the current election cycle."
          actionText="Cast Your First Vote"
          onAction={() => window.location.href = '/voter/categories'}
        />
      ) : (
        <div className="dashboard-panel">
          <div className="table-responsive-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Election Category</th>
                  <th>Candidate Selected</th>
                  <th>Date & Time</th>
                  <th>Ballot Number</th>
                  <th>Verification Code</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.category}</strong></td>
                    <td>{item.candidate}</td>
                    <td><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.date}</span></td>
                    <td>
                      <span className="receipt-id-tag" style={{ fontSize: '0.825rem', padding: '0.2rem 0.5rem' }}>
                        {item.receiptId}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                        {item.verificationCode || '—'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={item.status || 'Verified'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterHistory;

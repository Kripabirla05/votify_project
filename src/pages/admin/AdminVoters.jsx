import React, { useState } from 'react';
import { SearchBar } from '../../components/common/FormFields';
import { StatusBadge, EmptyState } from '../../components/common/UI';
import { RejectionModal, VoterDetailModal } from '../../components/admin/AdminModals';
import { useVoting } from '../../context/AppContext';
import { UsersIcon, CheckCircleIcon, XCircleIcon, EyeIcon } from '../../assets/icons';
import { calculateAge, formatDob } from '../../utils/age';

export const AdminVoters = () => {
  const { voters, approveVoter, rejectVoter, toggleVoterBlock } = useVoting();
  const [searchTerm, setSearchTerm] = useState('');
  const [kycFilter, setKycFilter] = useState('ALL');
  const [votingFilter, setVotingFilter] = useState('ALL');
  const [voterToReject, setVoterToReject] = useState(null);
  const [voterToReview, setVoterToReview] = useState(null);

  const filteredVoters = voters.filter(v => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.voterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.department && v.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesKyc = kycFilter === 'ALL' || v.kycStatus === kycFilter;
    const matchesVoting = votingFilter === 'ALL' || v.votingStatus === votingFilter;
    return matchesSearch && matchesKyc && matchesVoting;
  });

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <UsersIcon size={30} style={{ color: 'var(--primary)' }} />
            Voter Registry & Identity Directory
          </h1>
          <p>Central voter roll, KYC clearance checks, and ballot authorization controls.</p>
        </div>
      </div>
    
      <div className="filter-toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by voter name, ID, email..."
          style={{ width: '320px' }}
        />

        <div className="filter-group">
          <select
            className="form-select"
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="ALL">All KYC Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Blocked">Blocked</option>
          </select>

          <select
            className="form-select"
            value={votingFilter}
            onChange={(e) => setVotingFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="ALL">All Voting Statuses</option>
            <option value="Voted">Voted</option>
            <option value="Not Voted">Not Voted</option>
          </select>
        </div>
      </div>

      {filteredVoters.length === 0 ? (
        <EmptyState
          title="No Voters Found"
          description="No voter records match your search or status criteria."
        />
      ) : (
        <div className="dashboard-panel">
          <div className="table-responsive-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Voter Name & Department</th>
                  <th>Voter ID</th>
                  <th>Date of Birth</th>
                  <th>Email & Contact</th>
                  <th>KYC Status</th>
                  <th>Voting Status</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.map((voter) => (
                  <tr key={voter.id}>
                    <td>
                      <strong>{voter.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {voter.department || 'General Member'}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                        {voter.voterId}
                      </span>
                    </td>
                    <td>
                      <div>{voter.dob ? formatDob(voter.dob) : '—'}</div>
                      {calculateAge(voter.dob) !== null && (
                        <small style={{ color: 'var(--text-muted)' }}>Age {calculateAge(voter.dob)}</small>
                      )}
                    </td>
                    <td>
                      <div>{voter.email}</div>
                      <small style={{ color: 'var(--text-muted)' }}>{voter.phone}</small>
                    </td>
                    <td>
                      <StatusBadge status={voter.kycStatus} />
                      {voter.kycStatus === 'Rejected' && voter.rejectionReason && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--danger)', marginTop: '0.3rem', maxWidth: '190px' }}>
                          {voter.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={voter.votingStatus} />
                    </td>
                    <td>
                      <span className={`badge ${voter.accountStatus === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {voter.accountStatus}
                      </span>
                    </td>
                    <td>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '0.4rem',
                          width: 'max-content',
                          margin: '0 auto',
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setVoterToReview(voter)}
                        >
                          <EyeIcon size={14} />
                          View
                        </button>
                        {voter.kycStatus !== 'Verified' && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => approveVoter(voter.id)}
                          >
                            <CheckCircleIcon size={14} />
                            Approve
                          </button>
                        )}
                        {voter.kycStatus !== 'Rejected' && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => setVoterToReject(voter)}
                          >
                            <XCircleIcon size={14} />
                            Reject
                          </button>
                        )}
                        <button
                          type="button"
                          className={`btn btn-sm ${voter.accountStatus === 'Active' ? 'btn-outline' : 'btn-success'}`}
                          style={voter.accountStatus === 'Active' ? { color: 'var(--danger)', borderColor: 'var(--danger-light)' } : {}}
                          onClick={() => toggleVoterBlock(voter.id)}
                        >
                          {voter.accountStatus === 'Active' ? 'Block Access' : 'Unblock'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
       
      <VoterDetailModal
        isOpen={Boolean(voterToReview)}
        onClose={() => setVoterToReview(null)}
        voter={voterToReview}
        onApprove={approveVoter}
        onReject={(voter) => setVoterToReject(voter)}
      />

      <RejectionModal
        isOpen={Boolean(voterToReject)}
        onClose={() => setVoterToReject(null)}
        candidate={voterToReject}
        subjectType="voter"
        onConfirmReject={rejectVoter}
      />
    </div>
  );
};

export default AdminVoters;

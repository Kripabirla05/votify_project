import React, { useState } from 'react';
import { CandidateCard } from '../../components/common/Cards';
import { RejectionModal, CandidateDetailModal } from '../../components/admin/AdminModals';
import { SearchBar } from '../../components/common/FormFields';
import { EmptyState } from '../../components/common/UI';
import { useVoting } from '../../context/AppContext';
import { CandidateIcon } from '../../assets/icons';

export const AdminCandidates = () => {
  const { candidates, approveCandidate, rejectCandidate, categories } = useVoting();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch =
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || cand.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || cand.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleView = (candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailOpen(true);
  };

  const handleOpenReject = (candidate) => {
    setSelectedCandidate(candidate);
    setIsRejectOpen(true);
  };

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <CandidateIcon size={30} style={{ color: 'var(--primary)' }} />
            Candidate Applications & Roster
          </h1>
          <p>Review nominations, verify candidate credentials, approve or reject contest applications.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, email, or post..."
          style={{ width: '280px' }}
        />


        <div className="filter-group">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <EmptyState
          title="No Candidates Found"
          description="There are no candidate nominations matching the chosen filters."
        />
      ) : (
        <div className="cards-grid">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              role="admin"
              onView={handleView}
              onApprove={approveCandidate}
              onReject={handleOpenReject}
            />
          ))}
        </div>
      )}

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        candidate={selectedCandidate}
      />

      {/* Candidate Rejection Modal */}
      <RejectionModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        candidate={selectedCandidate}
        subjectType="candidate"
        onConfirmReject={rejectCandidate}
      />
    </div>
  );
};

export default AdminCandidates;

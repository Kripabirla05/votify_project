import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modals';
import { InputField } from '../common/FormFields';
import { StatusBadge } from '../common/UI';
import { CandidateIcon, CheckCircleIcon, XCircleIcon } from '../../assets/icons';
import { calculateAge, formatDob, MIN_VOTER_AGE } from '../../utils/age';

export const AddCategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    eligibility: 'All Verified Voters'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        startDate: initialData.startDate || '2026-08-20T09:00',
        endDate: initialData.endDate || '2026-08-30T18:00',
        eligibility: initialData.eligibility || 'All Verified Voters'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        startDate: '2026-08-20T09:00',
        endDate: '2026-08-30T18:00',
        eligibility: 'All Verified Voters'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Category name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.startDate) errs.startDate = 'Start date required';
    if (!formData.endDate) errs.endDate = 'End date required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
        {initialData ? 'Update Category' : 'Create Category'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Election Category" : "Add New Election Category"}
      subtitle="Configure election parameters, voting windows, and eligibility criteria."
      footer={footer}
    >
      <form onSubmit={handleSubmit}>
        <InputField
          label="Category Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. General Secretary, Sports Representative"
          required
          error={errors.name}
        />

        <div className="form-group">
          <label className="form-label">Description <span className="req">*</span></label>
          <textarea
            className="form-textarea"
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Key responsibilities and jurisdiction of this council role..."
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField
            label="Start Date & Time"
            name="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
            error={errors.startDate}
          />
          <InputField
            label="End Date & Time"
            name="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
            error={errors.endDate}
          />
        </div>

        <InputField
          label="Voter / Candidate Eligibility"
          name="eligibility"
          value={formData.eligibility}
          onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
          placeholder="e.g. All Verified Voters in good standing"
        />
      </form>
    </Modal>
  );
};

export const CandidateDetailModal = ({
  isOpen,
  onClose,
  candidate
}) => {
  if (!candidate) return null;

  const age = calculateAge(candidate.dob);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Profile Details"
      subtitle="Complete electoral submission information and credentials."
      size="normal"
      footer={<button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>}
    >
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div
          aria-hidden="true"
          style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <CandidateIcon size={34} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{candidate.name}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{candidate.category}</p>
          <div style={{ marginTop: '0.5rem' }}>
            <StatusBadge status={candidate.status} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</span>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{candidate.email}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Phone</span>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{candidate.phone || 'N/A'}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Date of Birth</span>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {candidate.dob ? formatDob(candidate.dob) : 'Not provided'}
          </p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Age</span>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {age !== null ? `${age} years` : 'N/A'}
          </p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Election Symbol</span>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{candidate.symbol} {candidate.symbolName || ''}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Applied Date</span>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{candidate.appliedDate || '2026-08-10'}</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>Candidate Bio</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{candidate.shortBio}</p>
      </div>

      <div>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>Election Manifesto</h4>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.875rem', fontStyle: 'italic' }}>
          "{candidate.manifesto}"
        </div>
      </div>
    </Modal>
  );
};

const DEFAULT_REJECTION_REASONS = {
  candidate: 'Application did not meet election prerequisite documentation guidelines.',
  voter: 'Identity documents did not meet voter registry requirements.',
};

export const RejectionModal = ({
  isOpen,
  onClose,
  candidate,
  subjectType = 'candidate',
  onConfirmReject
}) => {
  const [reason, setReason] = useState(DEFAULT_REJECTION_REASONS[subjectType] || DEFAULT_REJECTION_REASONS.candidate);

  const handleConfirm = () => {
    if (candidate) {
      onConfirmReject(candidate.id, reason);
      onClose();
    }
  };

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="btn btn-danger" onClick={handleConfirm}>
        Confirm Rejection
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subjectType === 'voter' ? 'Reject Voter Registration' : 'Reject Candidate Application'}
      subtitle={`Provide formal grounds for rejecting ${candidate?.name || `this ${subjectType}`}.`}
      footer={footer}
      size="sm"
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          {subjectType === 'voter' ? 'Voter' : 'Candidate'}: <strong>{candidate?.name}</strong>
          {' '}({subjectType === 'voter' ? candidate?.voterId : candidate?.category})
        </p>

        <div className="form-group">
          <label className="form-label">Rejection Reason <span className="req">*</span></label>
          <textarea
            className="form-textarea"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Specify reason for ${subjectType} notification...`}
          />
        </div>
      </div>
    </Modal>
  );
};

const VoterDetailField = ({ label, value }) => (
  <div>
    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
      {label}
    </span>
    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
  </div>
);

export const VoterDetailModal = ({
  isOpen,
  onClose,
  voter,
  onApprove,
  onReject
}) => {
  if (!voter) return null;

  const age = calculateAge(voter.dob);
  const meetsAgeRule = age !== null && age >= MIN_VOTER_AGE;

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
      {voter.kycStatus !== 'Rejected' && (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => { onReject(voter); onClose(); }}
        >
          <XCircleIcon size={16} />
          Reject
        </button>
      )}
      {voter.kycStatus !== 'Verified' && (
        <button
          type="button"
          className="btn btn-success"
          onClick={() => { onApprove(voter.id); onClose(); }}
        >
          <CheckCircleIcon size={16} />
          Approve KYC
        </button>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Voter KYC Review"
      subtitle="Check the submitted identity details before clearing this voter to cast a ballot."
      size="normal"
      footer={footer}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{voter.name}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{voter.voterId}</p>
        </div>
        <StatusBadge status={voter.kycStatus} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
        <VoterDetailField label="Email Address" value={voter.email || 'Not provided'} />
        <VoterDetailField label="Phone" value={voter.phone || 'Not provided'} />
        <VoterDetailField label="Date of Birth" value={voter.dob ? formatDob(voter.dob) : 'Not provided'} />
        <VoterDetailField label="Age" value={age !== null ? `${age} years` : 'Unknown'} />
        <VoterDetailField label="Registered On" value={voter.registeredDate || 'Unknown'} />
        <VoterDetailField label="Ballots Cast" value={voter.votesCast || 0} />
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          background: meetsAgeRule ? 'var(--success-light)' : 'var(--danger-light)',
          color: meetsAgeRule ? 'var(--success)' : 'var(--danger)',
        }}
      >
        {meetsAgeRule
          ? `Age check passed - ${age} years old, at or above the ${MIN_VOTER_AGE} year minimum.`
          : `Age check failed - voters must be at least ${MIN_VOTER_AGE} years old.`}
      </div>

      {voter.kycStatus === 'Rejected' && voter.rejectionReason && (
        <div style={{ marginTop: '1rem' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>Rejection Reason</h4>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.875rem' }}>
            {voter.rejectionReason}
          </div>
        </div>
      )}
    </Modal>
  );
};

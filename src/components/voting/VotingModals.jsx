import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ConfirmModal } from '../common/Modals';
import { InputField } from '../common/FormFields';
import { useVoting, useAuth } from '../../context/AppContext';
import { MIN_CANDIDATE_AGE, maxDobForAge, validateDob, calculateAge } from '../../utils/age';
import { VoteIcon, ShieldCheckIcon, CheckCircleIcon } from '../../assets/icons';

export const ApplyModal = ({
  isOpen,
  onClose,
  category
}) => {
  const { applyForCategory } = useVoting();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    symbol: '⚡',
    symbolName: 'Lightning Beacon',
    shortBio: '',
    manifesto: '',
  });

  const [errors, setErrors] = useState({});

  const candidateAge = calculateAge(formData.dob);

  // Writing into a field clears that field's error, so a message from an
  // earlier submit does not sit there contradicting what is now typed in.
  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const symbolOptions = [
    { icon: '🚀', name: 'Rocket of Progress' },
    { icon: '⚡', name: 'Lightning Beacon' },
    { icon: '🛡️', name: 'Shield of Integrity' },
    { icon: '🎭', name: 'Golden Mask' },
    { icon: '🎸', name: 'Electric Guitar' },
    { icon: '💻', name: 'Cyber Core' },
    { icon: '🔬', name: 'Quantum Prism' },
    { icon: '🏆', name: 'Championship Cup' },
    { icon: '📚', name: 'Knowledge Torch' }
  ];

  // Everything is checked in one pass so all outstanding problems show at
  // once, rather than one error per attempt.
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';

    const dobError = validateDob(formData.dob, MIN_CANDIDATE_AGE, 'Candidates');
    if (dobError) errs.dob = dobError;

    if (!formData.manifesto.trim()) errs.manifesto = 'Manifesto is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    applyForCategory({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      category: category.name,
      categoryId: category.id,
      symbol: formData.symbol,
      symbolName: formData.symbolName,
      shortBio: formData.shortBio,
      manifesto: formData.manifesto,
    });

    onClose();
  };

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
        Submit Candidacy Application
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${category?.name || 'Category'}`}
      subtitle="Complete your candidacy nomination form for admin screening."
      footer={footer}
      size="normal"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <InputField
            label="Candidate Name"
            name="name"
            value={formData.name}
            onChange={(e) => setField('name', e.target.value)}
            required
            error={errors.name}
          />
          <InputField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={(e) => setField('email', e.target.value)}
            required
          />
        </div>

        <InputField
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={(e) => setField('dob', e.target.value)}
          max={maxDobForAge(MIN_CANDIDATE_AGE)}
          required
          error={errors.dob}
        />
        <p className={`form-hint ${candidateAge !== null && candidateAge < MIN_CANDIDATE_AGE ? 'form-hint-warn' : ''}`}>
          {candidateAge === null
            ? `Candidates must be at least ${MIN_CANDIDATE_AGE} years old to contest.`
            : candidateAge >= MIN_CANDIDATE_AGE
              ? `Age ${candidateAge} - eligible to contest.`
              : `Age ${candidateAge} - candidates must be at least ${MIN_CANDIDATE_AGE} years old.`}
        </p>

        <div className="form-group">
          <label className="form-label">Select Campaign Symbol</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            {symbolOptions.map((sym) => (
              <button
                key={sym.name}
                type="button"
                className={`btn btn-secondary ${formData.symbol === sym.icon ? 'btn-primary' : ''}`}
                style={{ fontSize: '1.25rem', padding: '0.5rem 0.85rem' }}
                onClick={() => setFormData({ ...formData, symbol: sym.icon, symbolName: sym.name })}
                title={sym.name}
              >
                {sym.icon}
              </button>
            ))}
          </div>
          <small style={{ marginTop: '0.35rem', display: 'block' }}>Selected: <strong>{formData.symbol} {formData.symbolName}</strong></small>
        </div>

        <div className="form-group">
          <label className="form-label">Short Bio / Credentials</label>
          <input
            className="form-input"
            value={formData.shortBio}
            onChange={(e) => setField('shortBio', e.target.value)}
            placeholder="e.g. Operations Unit | Community Club Vice Lead"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Electoral Manifesto <span className="req">*</span></label>
          <textarea
            className="form-textarea"
            rows="3"
            value={formData.manifesto}
            onChange={(e) => setField('manifesto', e.target.value)}
            placeholder="Write your pledges, roadmap, and vision..."
          />
          {errors.manifesto && <span className="form-error">{errors.manifesto}</span>}
        </div>

        <div style={{ background: 'var(--primary-light)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--primary)' }}>
          ✓ By submitting, you agree to comply with election board conduct and campaign ethics.
        </div>
      </form>
    </Modal>
  );
};

export const VotingModal = ({
  isOpen,
  onClose,
  category,
  onSelectCandidate
}) => {
  const { candidates } = useVoting();

  if (!category) return null;

  const categoryCandidates = candidates.filter(
    c => c.category === category.name && c.status === 'Approved'
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ballot: ${category.name}`}
      subtitle="Select your preferred candidate to cast your official democratic ballot."
      size="normal"
      footer={
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel & Exit Ballot
        </button>
      }
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheckIcon size={20} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Each voter is allocated exactly <strong>1 verified ballot</strong> for this category.
          </span>
        </div>

        {categoryCandidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No approved candidates registered for this category yet.
          </div>
        ) : (
          categoryCandidates.map((cand) => (
            <div key={cand.id} className="voting-candidate-option">
              <div className="option-left">
                <div className="option-symbol">{cand.symbol || '🗳️'}</div>
                <div className="option-details">
                  <h4>{cand.name}</h4>
                  <p>{cand.shortBio || cand.manifesto}</p>
                  <Link
                    to={`/candidates/${cand.id}`}
                    style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)' }}
                  >
                    View full profile &rarr;
                  </Link>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onSelectCandidate(cand)}
              >
                <VoteIcon size={16} />
                Vote
              </button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export const ConfirmVoteModal = ({
  isOpen,
  onClose,
  onConfirm,
  candidate,
  categoryName
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirm Your Vote"
      message={`You are voting for ${candidate?.name || 'this candidate'} in the ${categoryName || ''} election.`}
      highlightText="⚠️ This action cannot be undone. Once submitted, your ballot is cryptographically recorded."
      confirmText="Confirm & Cast Ballot"
      cancelText="Review Ballot"
      type="primary"
    />
  );
};

export const VoteSuccessModal = ({
  isOpen,
  onClose,
  receiptData
}) => {
  if (!receiptData) return null;

  const footer = (
    <button type="button" className="btn btn-primary" onClick={onClose}>
      Done
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ballot Receipt"
      subtitle="Your vote has been verified and registered."
      footer={footer}
      size="normal"
    >
      <div className="receipt-box">
        <div className="receipt-header">
          <div style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>
            <CheckCircleIcon size={56} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ✓ Vote Successfully Recorded
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Official digital receipt generated by Votify System
          </p>
        </div>

        <div style={{ margin: '1rem 0' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Ballot Number
          </span>
          <div className="receipt-id-tag">
            {receiptData.receiptId}
          </div>
        </div>

        <div style={{ textAlign: 'left', marginTop: '1.25rem' }}>
          <div className="receipt-row">
            <span className="receipt-label">Category</span>
            <span className="receipt-value">{receiptData.historyEntry?.category || receiptData.category}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Candidate Voted</span>
            <span className="receipt-value">{receiptData.historyEntry?.candidate || receiptData.candidate}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Timestamp</span>
            <span className="receipt-value">{receiptData.historyEntry?.date || new Date().toLocaleString()}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Verification Code</span>
            <span className="receipt-value" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              {receiptData.verificationCode}
            </span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Status</span>
            <span className="receipt-value" style={{ color: 'var(--success)', fontWeight: 700 }}>
              Verified (Immutable)
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

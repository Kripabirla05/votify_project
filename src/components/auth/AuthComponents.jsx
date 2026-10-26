import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputField, PasswordField } from '../common/FormFields';
import { useAuth, useVoting } from '../../context/AppContext';
import { VoteIcon, ShieldCheckIcon, LockIcon, TrophyIcon, UserIcon, CandidateIcon, UsersIcon, FileTextIcon } from '../../assets/icons';
import { minAgeForRole, maxDobForAge, validateDob, calculateAge } from '../../utils/age';

export const RoleTabs = ({ activeRole, onRoleChange }) => {
  const roles = [
    { id: 'voter', label: 'Voter', icon: UsersIcon },
    { id: 'candidate', label: 'Candidate', icon: CandidateIcon },
    { id: 'admin', label: 'Admin', icon: ShieldCheckIcon },
  ];

  return (
    <div className="role-tabs-container" role="tablist">
      {roles.map((r) => {
        const Icon = r.icon;
        const isActive = activeRole === r.id;
        return (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`role-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onRoleChange(r.id)}
          >
            <Icon size={16} />
            {r.label}
          </button>
        );
      })}
    </div>
  );
};

export const LoginForm = ({ role }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Please enter a valid email address';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const result = await login(role, formData.email, formData.password);
      if (result.error) {
        // Unknown email, wrong role tab or wrong password: stay on the form.
        setErrors({ [result.field]: result.error });
        return;
      }
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'candidate') navigate('/candidate/dashboard');
      else navigate('/voter/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <InputField
        label={`${role.charAt(0).toUpperCase() + role.slice(1)} Email`}
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Enter your email address"
        required
        error={errors.email}
        icon={UserIcon}
      />

      <PasswordField
        label="Password"
        name="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="••••••••"
        required
        error={errors.password}
      />

      <div className="auth-actions-row">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked /> Remember portal
        </label>
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: '0.825rem' }}
          onClick={() => alert(`Demo password reset email sent to: ${formData.email || 'your email'}`)}
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        className="btn btn-primary auth-submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Authenticating...' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
      </button>
    </form>
  );
};

export const SignupForm = ({ role }) => {
  const { signup } = useAuth();
  const { categories, registerVoter, applyForCategory } = useVoting();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    voterId: '',
    dob: '',
    category: categories[0]?.name || '',
    manifesto: '',
    shortBio: '',
    adminCode: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editing a field drops its error message, so a warning never contradicts
  // what is currently typed in.
  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  // Voters must be 18+, candidates 21+ - see src/utils/age.js.
  const minAge = minAgeForRole(role);
  const enteredAge = calculateAge(formData.dob);
  const subjectLabel = role === 'candidate' ? 'Candidates' : 'Voters';

  const ageHint = enteredAge === null
    ? `${subjectLabel} must be at least ${minAge} years old on registration.`
    : enteredAge >= minAge
      ? `Age ${enteredAge} - eligible to register as a ${role}.`
      : `Age ${enteredAge} - ${subjectLabel.toLowerCase()} must be at least ${minAge} years old.`;

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Please provide a valid email';

    if (role === 'voter') {
      if (!formData.voterId.trim()) errs.voterId = 'Voter ID is required (e.g. SV-2026-XXXX)';
    }

    if (role === 'candidate') {
      if (!formData.manifesto.trim()) errs.manifesto = 'Please write a brief manifesto outline';
      if (categories.length > 0 && !formData.category) errs.category = 'Choose the category you are contesting';
    }

    if (role !== 'admin') {
      const dobError = validateDob(formData.dob, minAge, subjectLabel);
      if (dobError) errs.dob = dobError;
    }

    if (role === 'admin') {
      if (!formData.adminCode.trim()) errs.adminCode = 'Security invite code required';
    }

    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Minimum 6 characters';

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const result = await signup(role, formData);
      if (result.error) {
        // e.g. the email already has an account - nothing is created.
        setErrors({ [result.field]: result.error });
        return;
      }

      if (role === 'voter') {
        // New voters land on the admin registry as Pending KYC.
        registerVoter({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          voterId: formData.voterId,
        });
      }

      if (role === 'candidate') {
        // File the nomination the form just collected, so it reaches the
        // admin's candidate list instead of sitting only on the account.
        const chosenCategory = categories.find(c => c.name === formData.category);
        if (chosenCategory) {
          applyForCategory({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            dob: formData.dob,
            category: chosenCategory.name,
            categoryId: chosenCategory.id,
            manifesto: formData.manifesto,
            shortBio: formData.shortBio,
          });
        }
      }

      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'candidate') navigate('/candidate/dashboard');
      else navigate('/voter/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {role === 'candidate' && (
        <div className="auth-notice-box">
          <ShieldCheckIcon size={20} />
          <span>Notice: Candidate registration will be reviewed and verified by the Admin Board before listing.</span>
        </div>
      )}

      <InputField
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={(e) => setField('fullName', e.target.value)}
        placeholder="Enter your full name"
        required
        error={errors.fullName}
        icon={UserIcon}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setField('email', e.target.value)}
          placeholder="Enter your email address"
          required
          error={errors.email}
        />
        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setField('phone', e.target.value)}
          placeholder="+91 98765 43210"
        />
      </div>

      {role === 'voter' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <InputField
            label="Voter ID"
            name="voterId"
            value={formData.voterId}
            onChange={(e) => setField('voterId', e.target.value)}
            placeholder="SV-2026-XXXX"
            required
            error={errors.voterId}
          />
          <InputField
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={(e) => setField('dob', e.target.value)}
            max={maxDobForAge(minAge)}
            required
            error={errors.dob}
          />
        </div>
      )}

      {role !== 'admin' && (
        <p className={`form-hint ${enteredAge !== null && enteredAge < minAge ? 'form-hint-warn' : ''}`}>
          {ageHint}
        </p>
      )}

      {role === 'candidate' && (
        <>
          <InputField
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={(e) => setField('dob', e.target.value)}
            max={maxDobForAge(minAge)}
            required
            error={errors.dob}
          />

          <div className="form-group">
            <label className="form-label">Contesting Category <span className="req">*</span></label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setField('category', e.target.value)}
              disabled={categories.length === 0}
            >
              {categories.length === 0 ? (
                <option value="">No categories are open yet</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))
              )}
            </select>
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>

          {categories.length === 0 && (
            <p className="form-hint">
              An admin has to publish an election category before anyone can be nominated for it.
              You can still register now and apply from the Apply for Candidacy page once one opens.
            </p>
          )}

          <div className="form-group">
            <label className="form-label">Short Manifesto / Bio <span className="req">*</span></label>
            <textarea
              className="form-textarea"
              rows="2"
              value={formData.manifesto}
              onChange={(e) => setField('manifesto', e.target.value)}
              placeholder="Key objectives, pledges, and vision for the electorate..."
            />
            {errors.manifesto && <span className="form-error">{errors.manifesto}</span>}
          </div>
        </>
      )}

      {role === 'admin' && (
        <InputField
          label="Admin Invite / Security Code"
          name="adminCode"
          value={formData.adminCode}
          onChange={(e) => setField('adminCode', e.target.value)}
          placeholder="Enter your authorized admin token"
          required
          error={errors.adminCode}
          icon={ShieldCheckIcon}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={(e) => setField('password', e.target.value)}
          placeholder="••••••••"
          required
          error={errors.password}
        />
        <PasswordField
          label="Confirm"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => setField('confirmPassword', e.target.value)}
          placeholder="••••••••"
          required
          error={errors.confirmPassword}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary auth-submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering Account...' : `Complete ${role.charAt(0).toUpperCase() + role.slice(1)} Registration`}
      </button>
    </form>
  );
};

// Per-role brand copy shown on the left panel, in the voice of Votify's
// original login screen but adapted to this app's election data.
const ROLE_COPY = {
  voter: {
    heading: 'Cast a vote you can prove.',
    body: 'Sign in with your Voter ID and registered email. Every ballot is instant, encrypted, and impossible to alter once cast.',
  },
  candidate: {
    heading: 'Put your manifesto on the ballot.',
    body: 'Apply for a category, share your vision with the electorate, and track your approval status live from your dashboard.',
  },
  admin: {
    heading: 'Run the count. Own the audit trail.',
    body: 'Every admin action — approvals, results, announcements — is logged, timestamped, and fully auditable.',
  },
};

// Short trust points shown under the stats — the "why Votify" pitch,
// similar in spirit to the feature strip on the public landing page.
const TRUST_POINTS = [
  { icon: ShieldCheckIcon, title: 'End-to-end encrypted', body: 'Ballots are sealed the moment they leave your device.' },
  { icon: LockIcon, title: 'One voter, one ballot', body: 'The system blocks duplicate or re-cast votes automatically.' },
  { icon: TrophyIcon, title: 'Live, verifiable results', body: 'Tallies update in real time with a full public audit trail.' },
];

export const AuthCard = ({ defaultRole = 'voter', defaultMode = 'login' }) => {
  const [activeRole, setActiveRole] = useState(defaultRole);
  const [authMode, setAuthMode] = useState(defaultMode); // 'login' | 'signup'
  const { categories, candidates, voters } = useVoting();
  const cardRef = useRef(null);

  const copy = ROLE_COPY[activeRole];

  // Small live snapshot of the election, derived from the same data the
  // dashboards use — recalculated only when the underlying lists change.
  const stats = useMemo(() => ({
    categories: categories.length,
    candidates: candidates.filter((c) => c.status === 'Approved').length,
    voters: voters.length,
  }), [categories, candidates, voters]);

  // A small interactive touch: whenever the role or the login/signup
  // mode changes (so the form fields underneath are re-rendered), move
  // focus to the first input so the visitor can start typing right away.
  useEffect(() => {
    const firstField = cardRef.current?.querySelector('input, textarea, select');
    firstField?.focus({ preventScroll: true });
  }, [activeRole, authMode]);

  return (
    <div className="votify-auth-page">
      {/* ---------- Left: brand panel (hidden on mobile) ---------- */}
      <aside className="votify-auth-aside">
        <div className="votify-auth-glow votify-auth-glow-1" aria-hidden="true" />
        <div className="votify-auth-glow votify-auth-glow-2" aria-hidden="true" />

        <div className="votify-auth-brandmark">
          <span className="votify-auth-logo-badge">
            <VoteIcon size={26} />
          </span>
          <div>
            <div className="votify-auth-brand-name">Votify</div>
            <div className="votify-auth-brand-tag">Smart Voting System</div>
          </div>
        </div>

        <div className="votify-auth-copy">
          <p className="votify-auth-eyebrow">{activeRole}</p>
          <h1 className="votify-auth-heading">{copy.heading}</h1>
          <p className="votify-auth-body">{copy.body}</p>
        </div>

        <div className="votify-auth-stats" role="group" aria-label="Live election snapshot">
          <div className="votify-auth-stat">
            <span className="votify-auth-stat-value">{stats.categories}</span>
            <span className="votify-auth-stat-label">Categories</span>
          </div>
          <div className="votify-auth-stat">
            <span className="votify-auth-stat-value">{stats.candidates}</span>
            <span className="votify-auth-stat-label">Candidates</span>
          </div>
          <div className="votify-auth-stat">
            <span className="votify-auth-stat-value">{stats.voters}</span>
            <span className="votify-auth-stat-label">Registered voters</span>
          </div>
        </div>

        <ul className="votify-auth-trust-list">
          {TRUST_POINTS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="votify-auth-trust-item">
              <span className="votify-auth-trust-icon"><Icon size={20} /></span>
              <span>
                <strong>{title}.</strong> {body}
              </span>
            </li>
          ))}
        </ul>
      </aside>

      {/* ---------- Right: auth card ---------- */}
      <main className="votify-auth-main">
        <div className="votify-auth-inner">
          <div className="votify-auth-mobile-brand">
            <span className="votify-auth-logo-badge">
              <VoteIcon size={22} />
            </span>
            <div>
              <div className="votify-auth-brand-name">Votify</div>
              <div className="votify-auth-brand-tag">Smart Voting System</div>
            </div>
          </div>

          <RoleTabs activeRole={activeRole} onRoleChange={(r) => setActiveRole(r)} />

          <div className="votify-auth-card" ref={cardRef} key={`${activeRole}-${authMode}`}>
            <div className="votify-auth-card-head">
              <h2 className="votify-auth-card-title">
                {authMode === 'login' ? `${activeRole} login` : `${activeRole} sign up`}
              </h2>
              <button
                type="button"
                className="votify-mode-switch"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              >
                {authMode === 'login' ? 'Sign up instead' : 'Log in instead'}
              </button>
            </div>
            <p className="votify-auth-subtext">
              {authMode === 'login'
                ? 'New here? Switch to sign up — it only takes a minute.'
                : 'Already registered? Switch back to log in.'}
            </p>

            {authMode === 'login' ? (
              <LoginForm role={activeRole} />
            ) : (
              <SignupForm role={activeRole} />
            )}
          </div>

          <Link to="/" className="votify-back-home">&larr; Back to home</Link>
        </div>
      </main>
    </div>
  );
};

export default AuthCard;

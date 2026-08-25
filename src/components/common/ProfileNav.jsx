import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useTheme, useVoting } from '../../context/AppContext';
import { InputField } from './FormFields';
import { Modal } from './Modals';
import { BellIcon, UserIcon, SettingsIcon, SunIcon, MoonIcon, LogoutIcon, EditIcon } from '../../assets/icons';
import { minAgeForRole, maxDobForAge, validateDob, calculateAge, formatDob } from '../../utils/age';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { announcements } = useVoting();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown-menu-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="topbar-action-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <BellIcon size={18} />
        {announcements.length > 0 && <span className="notification-badge-dot" />}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>System Announcements</h4>
            <span className="badge badge-info">{announcements.length} Recent</span>
          </div>

          <div className="notification-list">
            {announcements.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active announcements
              </div>
            ) : (
              announcements.map(ann => (
                <div key={ann.id} className="notification-item unread">
                  <div className="notification-item-title">{ann.title}</div>
                  <div className="notification-item-text">{ann.content}</div>
                  <div className="notification-item-time">
                    By {ann.author} • {ann.date}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const getProfileLink = () => {
    if (role === 'admin') return '/admin/profile';
    if (role === 'candidate') return '/candidate/profile';
    return '/voter/profile';
  };

  const getSettingsLink = () => {
    if (role === 'admin') return '/admin/settings';
    return getProfileLink();
  };

  return (
    <div className="dropdown-menu-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="profile-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="profile-avatar profile-avatar-fallback">
          <UserIcon size={16} />
        </div>
        <div className="profile-info-mini">
          <span className="profile-name-mini">{user?.name || 'Guest User'}</span>
          <span className="profile-role-mini">{role || 'Visitor'}</span>
        </div>
      </button>

      {isOpen && (
        <div className="profile-dropdown-menu">
          <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.35rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>

          <Link
            to={getProfileLink()}
            className="profile-menu-item"
            onClick={() => setIsOpen(false)}
          >
            <UserIcon size={16} />
            My Profile
          </Link>

          <Link
            to={getSettingsLink()}
            className="profile-menu-item"
            onClick={() => setIsOpen(false)}
          >
            <SettingsIcon size={16} />
            Account Settings
          </Link>

          <button
            type="button"
            className="profile-menu-item"
            onClick={() => {
              toggleTheme();
              setIsOpen(false);
            }}
          >
            {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          <div className="profile-menu-divider" />

          <button
            type="button"
            className="profile-menu-item danger"
            onClick={handleLogout}
          >
            <LogoutIcon size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export const ProfileView = ({ title = "Account Profile" }) => {
  const { user, updateProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    department: user?.department || 'General Administration',
  });

  const [errors, setErrors] = useState({});

 
  const minAge = minAgeForRole(user?.role);
  const age = calculateAge(user?.dob);

  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (user?.role !== 'admin') {
      const dobError = validateDob(formData.dob, minAge, user?.role === 'candidate' ? 'Candidates' : 'Voters');
      if (dobError) {
        setErrors({ dob: dobError });
        return;
      }
    }

    setErrors({});
    updateProfile(formData);
    setIsEditModalOpen(false);
  };

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <UserIcon size={28} />
            {title}
          </h1>
          <p>Manage your account credentials, security settings, and demographic details.</p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsEditModalOpen(true)}
          >
            <EditIcon size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      <div>
        
        <div className="dashboard-panel">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem 0' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user?.name}</h2>
            <div className="badge badge-info" style={{ marginTop: '0.35rem' }}>
              {user?.role?.toUpperCase()} ACCOUNT
            </div>
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>{user?.email}</p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '1rem' }}>
            <div className="receipt-row">
              <span className="receipt-label">Full Legal Name</span>
              <span className="receipt-value">{user?.name}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Official Email</span>
              <span className="receipt-value">{user?.email}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Phone Contact</span>
              <span className="receipt-value">{user?.phone || '+91 99887 76655'}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Date of Birth</span>
              <span className="receipt-value">
                {user?.dob
                  ? `${formatDob(user.dob)}${age !== null ? ` (age ${age})` : ''}`
                  : 'Not provided'}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Portal Role</span>
              <span className="receipt-value" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Registered Since</span>
              <span className="receipt-value">{user?.joinedDate || 'August 2024'}</span>
            </div>
            {user?.voterId && (
              <div className="receipt-row">
                <span className="receipt-label">Voter Identification ID</span>
                <span className="receipt-value" style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{user.voterId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

     
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile Information"
        subtitle="Update your contact info and personal record details."
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile}>
          <InputField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <InputField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {user?.role !== 'admin' && (
            <InputField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              max={maxDobForAge(minAge)}
              required
              error={errors.dob}
            />
          )}
          <InputField
            label="Department / Unit"
            name="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
};

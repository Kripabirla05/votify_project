import React, { useState } from 'react';
import { LockIcon, EyeIcon, EyeOffIcon, SearchIcon, CloseIcon } from '../../assets/icons';

export const InputField = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      <div className={Icon ? "input-with-icon" : ""}>
        {Icon && (
          <span className="input-icon-left">
            <Icon size={18} />
          </span>
        )}
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`form-input ${error ? 'border-danger' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export const PasswordField = ({
  label = "Password",
  id,
  name = "password",
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  error,
  disabled = false,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      <div className="input-with-icon">
        <span className="input-icon-left">
          <LockIcon size={18} />
        </span>
        <input
          id={id || name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`form-input ${error ? 'border-danger' : ''}`}
          style={{ paddingRight: '2.6rem' }}
          {...props}
        />
        <button
          type="button"
          className="input-icon-right"
          onClick={() => setShowPassword(prev => !prev)}
          tabIndex="-1"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search records, candidates, IDs...",
  className = "",
  style = {}
}) => {
  return (
    <div className={`topbar-search ${className}`} style={style}>
      <span className="search-icon">
        <SearchIcon size={16} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Clear search"
        >
          <CloseIcon size={14} />
        </button>
      )}
    </div>
  );
};

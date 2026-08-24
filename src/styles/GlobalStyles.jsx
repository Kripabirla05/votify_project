import React from 'react';
const css = `

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --bg-main: #f8fafc;
  --bg-subtle: #f1f5f9;
  --surface: #ffffff;
  --surface-elevated: #ffffff;
  --surface-glass: rgba(255, 255, 255, 0.85);
  --border-color: #e2e8f0;
  --border-glass: rgba(226, 232, 240, 0.8);
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;

  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --primary-light: rgba(79, 70, 229, 0.1);
  --primary-glow: rgba(79, 70, 229, 0.25);
  
  --accent: #06b6d4;
  --accent-light: rgba(6, 182, 212, 0.1);
  
  --success: #10b981;
  --success-light: rgba(16, 185, 129, 0.12);
  --warning: #f59e0b;
  --warning-light: rgba(245, 158, 11, 0.12);
  --danger: #ef4444;
  --danger-light: rgba(239, 68, 68, 0.12);
  --info: #3b82f6;
  --info-light: rgba(59, 130, 246, 0.12);

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  --shadow-glow: 0 0 25px rgba(79, 70, 229, 0.25);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  --sidebar-width: 260px;
  --sidebar-collapsed-width: 80px;
  --topbar-height: 70px;
  --bottom-nav-height: 64px;

  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
  --transition-slow: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark, [data-theme="dark"] {
  --bg-main: #090d16;
  --bg-subtle: #0f172a;
  --surface: #131c2e;
  --surface-elevated: #1a243a;
  --surface-glass: rgba(19, 28, 46, 0.85);
  --border-color: #1e293b;
  --border-glass: rgba(255, 255, 255, 0.08);

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-inverse: #0f172a;

  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --primary-light: rgba(99, 102, 241, 0.15);
  --primary-glow: rgba(99, 102, 241, 0.35);

  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 12px 24px -4px rgba(0, 0, 0, 0.6);
  --shadow-xl: 0 24px 40px -8px rgba(0, 0, 0, 0.7);
  --shadow-glow: 0 0 30px rgba(99, 102, 241, 0.35);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: var(--font-sans);
  background-color: var(--bg-main);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color var(--transition-normal), color var(--transition-normal);
  overflow-x: hidden;
}

#root {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}


h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1.25;
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }
h4 { font-size: 1.1rem; }
p { color: var(--text-secondary); font-size: 0.95rem; }
small { font-size: 0.825rem; color: var(--text-muted); }
a { color: var(--primary); text-decoration: none; transition: color var(--transition-fast); }
a:hover { color: var(--primary-hover); }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.925rem;
  font-weight: 600;
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  user-select: none;
  position: relative;
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: #ffffff;
  box-shadow: 0 4px 12px var(--primary-glow);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-hover), #3730a3);
  box-shadow: 0 6px 18px var(--primary-glow);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-subtle);
  border-color: var(--text-muted);
}

.btn-success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}

.btn-outline {
  background: transparent;
  border-color: var(--border-color);
  color: var(--text-secondary);
}

.btn-outline:hover:not(:disabled) {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
}

.btn-icon {
  width: 38px;
  height: 38px;
  padding: 0;
  border-radius: var(--radius-md);
}

.btn-sm {
  font-size: 0.825rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-sm);
}

.btn-lg {
  font-size: 1rem;
  padding: 0.85rem 1.6rem;
  border-radius: var(--radius-lg);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.badge-success, .badge-verified, .badge-approved, .badge-active, .badge-voted {
  background-color: var(--success-light);
  color: var(--success);
}

.badge-warning, .badge-pending, .badge-upcoming {
  background-color: var(--warning-light);
  color: var(--warning);
}

.badge-danger, .badge-rejected, .badge-blocked, .badge-high {
  background-color: var(--danger-light);
  color: var(--danger);
}

.badge-info, .badge-not-voted, .badge-medium {
  background-color: var(--info-light);
  color: var(--info);
}

.badge-neutral, .badge-low, .badge-completed {
  background-color: var(--bg-subtle);
  color: var(--text-secondary);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.1rem;
  text-align: left;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-label span.req {
  color: var(--danger);
  margin-left: 2px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  font-family: var(--font-sans);
  font-size: 0.925rem;
  padding: 0.7rem 1rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-color);
  background-color: var(--surface);
  color: var(--text-primary);
  transition: all var(--transition-fast);
  outline: none;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.form-input::placeholder, .form-textarea::placeholder {
  color: var(--text-muted);
}

.form-error {
  font-size: 0.78rem;
  color: var(--danger);
  margin-top: 0.2rem;
}

.form-hint {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: -0.6rem 0 1.1rem;
}

.form-hint-warn {
  color: var(--danger);
  font-weight: 600;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon input {
  padding-left: 2.6rem;
}

.input-with-icon .input-icon-left {
  position: absolute;
  left: 0.85rem;
  color: var(--text-muted);
  pointer-events: none;
  display: flex;
  align-items: center;
}

.input-with-icon .input-icon-right {
  position: absolute;
  right: 0.85rem;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.04); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.role-demo-pill {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  background: var(--surface-elevated);
  border: 1px solid var(--border-glass);
  box-shadow: var(--shadow-xl), 0 0 20px rgba(0,0,0,0.2);
  border-radius: var(--radius-full);
  padding: 0.4rem 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(12px);
}

.role-demo-pill .pill-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  padding-left: 0.4rem;
}

.role-demo-pill .role-btn {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.role-demo-pill .role-btn.active {
  background: var(--primary);
  color: #ffffff;
  box-shadow: 0 2px 8px var(--primary-glow);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-main);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

.app-layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-main);
}

.app-main-viewport {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left var(--transition-slow);
}

.app-main-viewport.sidebar-collapsed {
  margin-left: var(--sidebar-collapsed-width);
}

.page-content-container {
  flex: 1;
  padding: 2rem 2.25rem 4rem 2.25rem;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

.page-header-banner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.page-title-group h1 {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title-group p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.page-header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}


.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.stat-card-info {
  display: flex;
  flex-direction: column;
}

.stat-card-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
}

.stat-card-value {
  font-size: 1.95rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-card-subtext {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.stat-card-icon-box {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-box-primary {
  background: var(--primary-light);
  color: var(--primary);
}

.icon-box-accent {
  background: var(--accent-light);
  color: var(--accent);
}

.icon-box-success {
  background: var(--success-light);
  color: var(--success);
}

.icon-box-warning {
  background: var(--warning-light);
  color: var(--warning);
}

.dashboard-grid-2col {
  display: grid;
  grid-template-columns: 2fr 1.2fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-panel {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-responsive-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.data-table th {
  background-color: var(--bg-subtle);
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid var(--border-color);
}

.data-table td {
  padding: 0.95rem 1.1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  vertical-align: middle;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr {
  transition: background-color var(--transition-fast);
}

.data-table tbody tr:hover {
  background-color: var(--bg-subtle);
}

.css-chart-bar-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.bar-chart-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.bar-row-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
}

.bar-track {
  height: 10px;
  background-color: var(--bg-subtle);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  background: linear-gradient(90deg, var(--primary), var(--accent));
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.donut-stat-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1.5rem 0;
}

.donut-chart-svg {
  transform: rotate(-90deg);
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.donut-legend-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.legend-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}


.filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}


.activity-feed-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-feed-item {
  display: flex;
  gap: 1rem;
  position: relative;
}

.activity-icon-bullet {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--primary);
  border: 1px solid var(--border-color);
}

.activity-feed-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-header-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.activity-body-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.15rem;
}

.activity-time-stamp {
  font-size: 0.75rem;
  color: var(--text-muted);
}


.app-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background-color: var(--surface);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 50;
  transition: width var(--transition-slow), transform var(--transition-slow);
}

.app-sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}


.sidebar-header {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px var(--primary-glow);
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}

.brand-role-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sidebar-collapse-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.sidebar-collapse-btn:hover {
  background-color: var(--bg-subtle);
  color: var(--text-primary);
}


.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sidebar-nav-section {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.5rem 0.85rem;
  margin-top: 0.5rem;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.95rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.925rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
  white-space: nowrap;
}

.sidebar-nav-link svg {
  flex-shrink: 0;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.sidebar-nav-link:hover {
  background-color: var(--bg-subtle);
  color: var(--text-primary);
}

.sidebar-nav-link:hover svg {
  color: var(--primary);
}

.sidebar-nav-link.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 700;
}

.sidebar-nav-link.active svg {
  color: var(--primary);
}

.sidebar-nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 15%;
  width: 4px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background: var(--primary);
}

.sidebar-link-badge {
  margin-left: auto;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
  background: var(--primary);
  color: #ffffff;
}


.sidebar-footer {
  padding: 1rem 0.85rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-logout-btn {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.95rem;
  width: 100%;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--danger);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sidebar-logout-btn:hover {
  background-color: var(--danger-light);
}


.app-sidebar.collapsed .brand-text,
.app-sidebar.collapsed .sidebar-nav-section,
.app-sidebar.collapsed .nav-text,
.app-sidebar.collapsed .sidebar-link-badge,
.app-sidebar.collapsed .logout-text {
  display: none;
}

.app-sidebar.collapsed .sidebar-nav-link {
  justify-content: center;
  padding: 0.75rem 0;
}

.app-sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 0;
}

.app-sidebar.collapsed .sidebar-collapse-btn {
  display: none;
}


.app-topbar {
  height: var(--topbar-height);
  background-color: var(--surface-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.75rem;
  transition: all var(--transition-normal);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.mobile-menu-trigger {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: var(--radius-sm);
}

.topbar-search {
  position: relative;
  width: 320px;
}

.topbar-search input {
  width: 100%;
  padding: 0.55rem 1rem 0.55rem 2.4rem;
  font-size: 0.875rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background-color: var(--bg-subtle);
  color: var(--text-primary);
  outline: none;
  transition: all var(--transition-fast);
}

.topbar-search input:focus {
  background-color: var(--surface);
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
  width: 360px;
}

.topbar-search .search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}


.topbar-right {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.topbar-action-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--surface);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all var(--transition-fast);
}

.topbar-action-btn:hover {
  background-color: var(--bg-subtle);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.notification-badge-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-color: var(--danger);
  border-radius: 50%;
  border: 2px solid var(--surface);
}


.dropdown-menu-wrapper {
  position: relative;
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 340px;
  background: var(--surface-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 100;
  animation: fadeIn 0.2s ease-out;
  overflow: hidden;
}

.dropdown-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdown-header h4 {
  font-size: 0.95rem;
  font-weight: 700;
}

.notification-list {
  max-height: 320px;
  overflow-y: auto;
}

.notification-item {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  transition: background var(--transition-fast);
  cursor: pointer;
}

.notification-item:hover {
  background-color: var(--bg-subtle);
}

.notification-item.unread {
  background-color: var(--primary-light);
}

.notification-item-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.2rem;
}

.notification-item-text {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 0.35rem;
}

.notification-item-time {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.profile-trigger-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0.6rem 0.35rem 0.35rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background-color: var(--surface);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.profile-trigger-btn:hover {
  background-color: var(--bg-subtle);
  border-color: var(--text-muted);
}

.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.profile-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-subtle);
  color: var(--primary);
  flex-shrink: 0;
}

.profile-info-mini {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.profile-name-mini {
  font-size: 0.825rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.profile-role-mini {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: capitalize;
}

.profile-dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 220px;
  background: var(--surface-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: 0.5rem;
  z-index: 100;
  animation: fadeIn 0.2s ease-out;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  transition: background var(--transition-fast);
}

.profile-menu-item:hover {
  background-color: var(--bg-subtle);
}

.profile-menu-item.danger {
  color: var(--danger);
}

.profile-menu-item.danger:hover {
  background-color: var(--danger-light);
}

.profile-menu-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 0.4rem 0;
}



.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all var(--transition-fast);
  position: relative;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-light);
}

.category-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.category-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.category-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1.25rem;
  flex-grow: 1;
}

.category-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 0.85rem;
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
  margin-bottom: 1.25rem;
}

.category-meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
}

.meta-val {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
}

.category-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}


.candidate-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.candidate-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.candidate-card-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.candidate-avatar-wrapper {
  position: relative;
}

.candidate-img {
  width: 68px;
  height: 68px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-subtle);
  color: var(--primary);
  flex-shrink: 0;
}

.candidate-symbol-badge {
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface-elevated);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  border: 1px solid var(--border-color);
}

.candidate-header-meta h3 {
  font-size: 1.15rem;
  margin-bottom: 0.2rem;
}

.candidate-category-tag {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
}

.candidate-bio {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-bottom: 1rem;
}

.candidate-manifesto-box {
  background-color: var(--bg-subtle);
  border-left: 3px solid var(--primary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 0.75rem 0.95rem;
  font-size: 0.825rem;
  color: var(--text-primary);
  font-style: italic;
  margin-bottom: 1.25rem;
  flex-grow: 1;
}

.candidate-card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

/* Candidate Voting Card in Vote Modal */
.voting-candidate-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem;
  background: var(--surface);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: 0.85rem;
}

.voting-candidate-option:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.voting-candidate-option.selected {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 0 0 2px var(--primary-glow);
}

.option-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.option-symbol {
  font-size: 1.75rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
}

.option-details h4 {
  font-size: 1.05rem;
  margin-bottom: 0.2rem;
}

.option-details p {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Countdown Timer */
.countdown-container {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.countdown-box {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.5rem;
  text-align: center;
  min-width: 34px;
}

.countdown-box span.num {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
}

.countdown-box span.lbl {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* Results Rank Card & Winner Badge */
.results-rank-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.results-rank-card.winner-card {
  border: 2px solid #f59e0b;
  background: linear-gradient(135deg, var(--surface), rgba(245, 158, 11, 0.08));
}

.winner-badge-pill {
  position: absolute;
  top: 10px;
  right: 12px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
}

.rank-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-muted);
  width: 40px;
  text-align: center;
}

.winner-card .rank-number {
  color: #f59e0b;
}

/* Receipt Card */
.receipt-box {
  background: var(--surface-elevated);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  text-align: center;
  position: relative;
}

.receipt-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.receipt-id-tag {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-light);
  padding: 0.4rem 1rem;
  border-radius: var(--radius-md);
  display: inline-block;
  margin: 0.5rem 0;
  letter-spacing: 0.08em;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
}

.receipt-row:last-child {
  border-bottom: none;
}

.receipt-label {
  color: var(--text-muted);
}

.receipt-value {
  font-weight: 600;
  color: var(--text-primary);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(9, 13, 22, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-container {
  background: var(--surface-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl), 0 0 35px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-container.modal-lg {
  max-width: 720px;
}

.modal-container.modal-sm {
  max-width: 440px;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title-group {
  display: flex;
  flex-direction: column;
}

.modal-title-group h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-title-group p {
  font-size: 0.825rem;
  color: var(--text-muted);
}

.modal-close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.35rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.modal-close-btn:hover {
  background-color: var(--bg-subtle);
  color: var(--text-primary);
}

.modal-body {
  padding: 1.75rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1.25rem 1.75rem;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Confirmation Modal Alert Box */
.confirm-alert-box {
  text-align: center;
  padding: 1rem 0;
}

.confirm-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: 0 auto 1.25rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-icon-danger {
  background: var(--danger-light);
  color: var(--danger);
}

.confirm-icon-warning {
  background: var(--warning-light);
  color: var(--warning);
}

.confirm-icon-primary {
  background: var(--primary-light);
  color: var(--primary);
}

.confirm-icon-success {
  background: var(--success-light);
  color: var(--success);
}

.confirm-alert-box h3 {
  font-size: 1.35rem;
  margin-bottom: 0.5rem;
}

.confirm-alert-box p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.highlight-box {
  background: var(--surface);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background-color: var(--surface-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-color);
  z-index: 90;
  padding: 0 0.5rem;
}

.bottom-nav-list {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  list-style: none;
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  justify-content: center;
}

.bottom-nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 600;
  text-decoration: none;
  padding: 0.35rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  width: 100%;
}

.bottom-nav-link svg {
  width: 20px;
  height: 20px;
}

.bottom-nav-link.active {
  color: var(--primary);
}

.bottom-nav-link.active svg {
  transform: translateY(-2px);
}

/* Tablet & Mobile Breakpoints */
@media (max-width: 1024px) {
  .dashboard-grid-2col {
    grid-template-columns: 1fr;
  }
  
  .dashboard-grid-3col {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    width: var(--sidebar-width) !important;
  }

  .app-sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  }

  .app-main-viewport {
    margin-left: 0 !important;
    padding-bottom: calc(var(--bottom-nav-height) + 1rem);
  }

  .mobile-menu-trigger {
    display: flex;
  }

  .mobile-bottom-nav {
    display: block;
  }

  .page-content-container {
    padding: 1.25rem 1rem 3rem 1rem;
  }

  .page-header-banner {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .topbar-search {
    display: none;
  }

  .profile-info-mini {
    display: none;
  }

  .role-demo-pill {
    bottom: calc(var(--bottom-nav-height) + 12px);
    right: 12px;
    padding: 0.3rem 0.5rem;
  }
  
  .role-demo-pill .pill-label {
    display: none;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .auth-card-wrapper {
    padding: 1.75rem 1.25rem;
  }

  .role-tabs-container {
    grid-template-columns: 1fr;
  }

  .donut-stat-wrapper {
    flex-direction: column;
    gap: 1rem;
  }
}

`;

export default function GlobalStyles() {
  return <style>{css}</style>;
}

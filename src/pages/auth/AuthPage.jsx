import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthCard from '../../components/auth/AuthComponents';

/*
 * AuthPage
 * --------
 * The sign-in / sign-up screen, styled after Votify's login page: a
 * dark "civic ledger" split screen (ink + gold + paper) with a brand
 * panel on the left and a floating paper-white auth card on the right.
 * All of its CSS lives right here in this file (a <style> tag built
 * from a template string) so nothing needs a separate .css file.
 */

const authPageCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.votify-auth-page {
  --auth-ink: #10192E;
  --auth-ink-light: #1B2A4A;
  --auth-ink-soft: #28395C;
  --auth-paper: #F6F4EC;
  --auth-paper-dim: #E2DDCE;
  --auth-paper-card: #F6F4EC;
  --auth-gold: #B8863A;
  --auth-gold-bright: #D4A24C;
  --auth-gold-dim: #8C6A2E;
  --auth-red: #7A1F2B;
  --auth-slate: #5B6472;
  --auth-font-display: 'Fraunces', serif;
  --auth-font-body: 'Inter', sans-serif;
  --auth-font-mono: 'IBM Plex Mono', monospace;

  min-height: 100vh;
  width: 100%;
  background: var(--auth-ink);
  color: var(--auth-paper);
  font-family: var(--auth-font-body);
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .votify-auth-page {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.votify-auth-aside {
  display: none;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1.6rem;
  background: var(--auth-ink-light);
  padding: 3rem;
}

.votify-auth-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.35;
  pointer-events: none;
  animation: votifyPulse 9s ease-in-out infinite alternate;
}
.votify-auth-glow-1 { width: 280px; height: 280px; background: rgba(212, 162, 76, 0.4); top: -60px; left: -40px; }
.votify-auth-glow-2 { width: 260px; height: 260px; background: rgba(47, 107, 79, 0.35); bottom: 10%; right: -60px; animation-delay: 2.5s; }

@keyframes votifyPulse {
  from { transform: scale(1) translateY(0); opacity: 0.28; }
  to { transform: scale(1.15) translateY(-10px); opacity: 0.42; }
}

@media (prefers-reduced-motion: reduce) {
  .votify-auth-glow { animation: none; }
}

@media (min-width: 768px) {
  .votify-auth-aside {
    display: flex;
  }
}

.votify-auth-brandmark,
.votify-auth-mobile-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.votify-auth-mobile-brand {
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .votify-auth-mobile-brand {
    display: none;
  }
}

.votify-auth-logo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 9999px;
  flex-shrink: 0;
  background: radial-gradient(circle at 30% 30%, rgba(212, 162, 76, 0.35), rgba(184, 134, 58, 0.08));
  border: 1px solid rgba(212, 162, 76, 0.4);
  color: var(--auth-gold-bright);
}

.votify-auth-brand-name {
  font-family: var(--auth-font-display);
  font-size: 1.35rem;
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.votify-auth-brand-tag {
  margin-top: 0.15rem;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--auth-slate);
}

.votify-auth-aside .votify-auth-brand-tag {
  color: rgba(237, 234, 224, 0.55);
}

.votify-auth-copy {
  max-width: 24rem;
}

.votify-auth-eyebrow {
  margin: 0;
  font-family: var(--auth-font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--auth-gold-bright);
}

.votify-auth-heading {
  margin: 1rem 0 0;
  font-family: var(--auth-font-display);
  font-size: 2.1rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-weight: 600;
  color: var(--auth-paper);
}

.votify-auth-body {
  margin: 1.1rem 0 0;
  font-size: 0.9rem;
  line-height: 1.65;
  color: rgba(237, 234, 224, 0.72);
}

/* Live election snapshot — 3 quick stats pulled from the same voting
   data the dashboards use, so the numbers here are always accurate. */
.votify-auth-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  max-width: 24rem;
}

.votify-auth-stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.75rem 0.6rem;
  border-radius: 0.65rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.votify-auth-stat-value {
  font-family: var(--auth-font-display);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--auth-gold-bright);
  line-height: 1;
}

.votify-auth-stat-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(237, 234, 224, 0.55);
}

/* "Why Votify" trust points */
.votify-auth-trust-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  max-width: 28rem;
}

.votify-auth-trust-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  font-size: 1.1rem;
  line-height: 1.65;
  color: rgba(237, 234, 224, 0.8);
}

.votify-auth-trust-item strong {
  color: var(--auth-paper);
  font-weight: 600;
}

.votify-auth-trust-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  margin-top: 0.05rem;
  background: rgba(212, 162, 76, 0.14);
  color: var(--auth-gold-bright);
}

.votify-auth-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.votify-auth-inner {
  width: 100%;
  max-width: 28rem;
}

.role-tabs-container {
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 0.375rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.375rem;
}

.role-tab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 0.5rem;
  border-radius: 0.65rem;
  border: none;
  background: transparent;
  color: rgba(237, 234, 224, 0.7);
  font-family: var(--auth-font-body);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.role-tab-btn:hover {
  color: var(--auth-paper);
  background: rgba(255, 255, 255, 0.05);
}

.role-tab-btn.active {
  background: var(--auth-gold);
  color: var(--auth-ink);
  box-shadow: 0 4px 14px rgba(184, 134, 58, 0.35);
}

.votify-auth-card {
  margin-top: 1rem;
  border-radius: 1rem;
  background: var(--auth-paper-card);
  padding: 2rem;
  color: var(--auth-ink);
  box-shadow: 0 20px 60px -20px rgba(16, 25, 46, 0.45);
  animation: votifyCardIn 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes votifyCardIn {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.votify-back-home {
  display: block;
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.78rem;
  color: rgba(237, 234, 224, 0.55);
  transition: color 0.15s ease;
}
.votify-back-home:hover {
  color: var(--auth-gold-bright);
}

.votify-auth-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.votify-auth-card-title {
  font-family: var(--auth-font-display);
  font-size: 1.5rem;
  line-height: 1.2;
  text-transform: capitalize;
  margin: 0;
  color: var(--auth-ink);
}

.votify-mode-switch {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--auth-red);
  white-space: nowrap;
  font-family: var(--auth-font-body);
}

.votify-mode-switch:hover {
  text-decoration: underline;
}

.votify-auth-subtext {
  margin: 0 0 1.5rem;
  font-size: 0.75rem;
  color: var(--auth-slate);
}

/* Re-skin the app's shared form components just inside this card */
.votify-auth-card .form-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--auth-slate);
}

.votify-auth-card .form-input,
.votify-auth-card .form-select,
.votify-auth-card .form-textarea {
  background: #ffffff;
  border: 1px solid rgba(16, 25, 46, 0.15);
  color: var(--auth-ink);
  border-radius: 0.6rem;
  font-family: var(--auth-font-body);
}

.votify-auth-card .form-input:focus,
.votify-auth-card .form-select:focus,
.votify-auth-card .form-textarea:focus {
  border-color: var(--auth-gold);
  box-shadow: 0 0 0 3px rgba(212, 162, 76, 0.25);
  outline: none;
}

.votify-auth-card .form-error {
  color: var(--auth-red);
}

.votify-auth-card .input-icon-left,
.votify-auth-card .input-icon-right {
  color: var(--auth-slate);
}

.votify-auth-card .auth-actions-row label,
.votify-auth-card .auth-actions-row button {
  color: var(--auth-slate) !important;
}

.votify-auth-card .auth-actions-row button:hover {
  color: var(--auth-red) !important;
}

.votify-auth-card .auth-notice-box {
  background: rgba(184, 134, 58, 0.12);
  border: 1px solid rgba(184, 134, 58, 0.3);
  color: var(--auth-ink);
}

.votify-auth-card .btn.auth-submit-btn {
  width: 100%;
  background: var(--auth-ink);
  color: var(--auth-paper);
  border: none;
  border-radius: 0.6rem;
  padding: 0.85rem;
  font-family: var(--auth-font-body);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.15s ease;
}

.votify-auth-card .btn.auth-submit-btn:hover:not(:disabled) {
  background: var(--auth-ink-soft);
}

.votify-auth-card .btn.auth-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

`;

export const AuthPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialRole = searchParams.get('role') || 'voter';
  const initialMode = location.pathname.includes('signup') ? 'signup' : 'login';

  return (
    <>
      <style>{authPageCss}</style>

      <AuthCard defaultRole={initialRole} defaultMode={initialMode} />
    </>
  );
};

export default AuthPage;

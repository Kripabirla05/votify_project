import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/common/UI';
import { useVoting } from '../context/AppContext';
import {
  VoteIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChevronRightIcon,
  MenuIcon,
  CloseIcon,
} from '../assets/icons';

// Rotating one-liners shown just under the hero — quick facts about how
// the platform works, so there's always "some information about the
// project" visible even before a visitor starts scrolling.
const QUICK_FACTS = [
  'Every ballot generates a verifiable ballot number the moment it is cast.',
  'Role-based access keeps Voter, Candidate, and Admin portals fully separate.',
  'Live turnout and results update the instant a vote is recorded.',
  'Candidate applications go through an Admin approval workflow before listing.',
];

const NAV_LINKS = [
  { id: 'how-it-works', label: 'How It Works' },
];

const homeCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

/* =====================================================================
   Votify landing page — same palette as the login / sign-up screen:
   deep navy ink, gold accents, cream "paper" cards, Fraunces headings.
   ===================================================================== */
.home-page {
  --h-ink: #10192E;
  --h-ink-light: #1B2A4A;
  --h-ink-soft: #28395C;
  --h-paper: #F6F4EC;
  --h-paper-card: #F6F4EC;
  --h-white: #FFFFFF;
  --h-gold: #B8863A;
  --h-gold-bright: #D4A24C;
  --h-gold-dim: #8C6A2E;
  --h-red: #7A1F2B;
  --h-green: #2F6B4F;
  --h-slate: #5B6472;
  --h-line: rgba(255, 255, 255, 0.09);
  --h-font-display: 'Fraunces', Georgia, serif;
  --h-font-body: 'Inter', system-ui, sans-serif;
  --h-font-mono: 'IBM Plex Mono', ui-monospace, monospace;

  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(1200px 600px at 12% -10%, rgba(212, 162, 76, 0.10), transparent 60%),
    radial-gradient(900px 500px at 100% 20%, rgba(47, 107, 79, 0.12), transparent 60%),
    linear-gradient(180deg, var(--h-ink) 0%, #0D1526 100%);
  color: var(--h-paper);
  font-family: var(--h-font-body);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* faint ballot-paper grid texture over the whole page */
.home-page::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse at 50% 20%, #000 0%, transparent 75%);
  mask-image: radial-gradient(ellipse at 50% 20%, #000 0%, transparent 75%);
}
.home-page > * { position: relative; }

/* The dashboard shell CSS pins html/body to exactly one viewport's
   height (so its own sidebar layouts can scroll internally). This page
   is a normal long-scrolling document, so while it's mounted we let
   body grow to its natural content height and hand scrolling back to
   the window. This rule lives inside Home's own <style> tag, so it
   disappears the moment the visitor navigates away from "/". */
body { height: auto; min-height: 100%; }
html { scroll-behavior: smooth; }

.home-page a { text-decoration: none; }
.home-page a:not(.home-btn) { color: inherit; }
.home-page ul { list-style: none; margin: 0; padding: 0; }

/* Headings: the global theme paints h1-h6 with the dark text colour, which
   disappears on this navy page — force them to white here. */
.home-page h1,
.home-page h2,
.home-page h3,
.home-page h4 {
  font-family: var(--h-font-display);
  font-weight: 600;
  color: var(--h-white);
  margin: 0;
  letter-spacing: -0.015em;
}

.home-page :focus-visible {
  outline: 2px solid var(--h-gold-bright);
  outline-offset: 3px;
  border-radius: 0.4rem;
}

/* ---------- Nav ---------- */
.home-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.75rem;
  background: rgba(16, 25, 46, 0.55);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border-bottom: 1px solid transparent;
  transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.home-nav.is-scrolled {
  background: rgba(16, 25, 46, 0.9);
  border-bottom-color: var(--h-line);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
}

.home-nav-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-family: var(--h-font-display);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--h-white);
  letter-spacing: 0.01em;
}

.home-nav-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 9999px;
  background: radial-gradient(circle at 30% 30%, rgba(212, 162, 76, 0.4), rgba(184, 134, 58, 0.08));
  border: 1px solid rgba(212, 162, 76, 0.45);
  color: var(--h-gold-bright);
  flex-shrink: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.home-nav-brand:hover .home-nav-logo {
  transform: rotate(-8deg) scale(1.06);
  box-shadow: 0 0 0 6px rgba(212, 162, 76, 0.12);
}

.home-nav-links {
  display: none;
  align-items: center;
  gap: 2rem;
  font-size: 0.86rem;
  font-weight: 600;
  color: rgba(237, 234, 224, 0.78);
}

.home-nav-links button {
  position: relative;
  background: none;
  border: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  padding: 0.3rem 0;
  transition: color 0.2s ease;
}
.home-nav-links button::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  height: 2px;
  width: 100%;
  background: var(--h-gold-bright);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}
.home-nav-links button:hover { color: var(--h-white); }
.home-nav-links button:hover::after { transform: scaleX(1); }

@media (min-width: 900px) {
  /* Take the space between the brand and the action buttons and centre the
     links inside it, rather than letting them sit against the brand. */
  .home-nav-links { display: flex; flex: 1; justify-content: center; }
}

.home-nav-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* ---------- Buttons ---------- */
.home-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.6rem 1.2rem;
  border-radius: 0.65rem;
  font-family: var(--h-font-body);
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  overflow: hidden;
  transition: transform 0.18s ease, background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}
.home-btn:hover { transform: translateY(-2px); }
.home-btn:active { transform: translateY(0); }

.home-btn-ghost {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.16);
  color: var(--h-white);
}
.home-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.11);
  border-color: rgba(212, 162, 76, 0.55);
}

.home-btn-solid {
  background: linear-gradient(135deg, var(--h-gold-bright), var(--h-gold));
  color: var(--h-ink);
  box-shadow: 0 10px 24px rgba(184, 134, 58, 0.32);
}
.home-btn-solid::after {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.45), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
}
.home-btn-solid:hover { box-shadow: 0 14px 30px rgba(212, 162, 76, 0.42); }
.home-btn-solid:hover::after { left: 130%; }

.home-btn-dark {
  background: var(--h-ink);
  color: var(--h-white);
  box-shadow: 0 10px 22px rgba(16, 25, 46, 0.35);
}
.home-btn-dark:hover { background: var(--h-ink-light); }

.home-btn-outline-dark {
  background: transparent;
  color: var(--h-ink);
  border-color: rgba(16, 25, 46, 0.3);
}
.home-btn-outline-dark:hover { background: rgba(16, 25, 46, 0.06); border-color: var(--h-ink); }

.home-menu-toggle {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0.55rem;
  color: var(--h-white);
  padding: 0.45rem;
  cursor: pointer;
}
@media (min-width: 900px) { .home-menu-toggle { display: none; } }

.home-mobile-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1.75rem 1.25rem;
  background: rgba(16, 25, 46, 0.97);
  border-bottom: 1px solid var(--h-line);
  animation: homeFadeDown 0.22s ease both;
}
@media (min-width: 900px) { .home-mobile-menu { display: none; } }

.home-mobile-menu button {
  text-align: left;
  background: none;
  border: none;
  color: var(--h-white);
  font: inherit;
  font-weight: 600;
  padding: 0.7rem 0.2rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

/* ---------- Hero ---------- */
.home-hero {
  position: relative;
  padding: 5.5rem 1.5rem 3.5rem;
  text-align: center;
  overflow: hidden;
}

.home-hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  animation: homePulse 10s ease-in-out infinite alternate;
}
.home-hero-glow-1 { width: 460px; height: 460px; background: rgba(212, 162, 76, 0.32); top: -160px; left: 6%; }
.home-hero-glow-2 { width: 400px; height: 400px; background: rgba(47, 107, 79, 0.3); bottom: -170px; right: 5%; animation-delay: 3s; }

@keyframes homePulse {
  from { transform: scale(1) translateY(0); opacity: 0.35; }
  to { transform: scale(1.14) translateY(-14px); opacity: 0.55; }
}
@keyframes homeFadeDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes homeRise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes homeFactIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes homeDot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212, 162, 76, 0.55); }
  50% { box-shadow: 0 0 0 6px rgba(212, 162, 76, 0); }
}

.home-hero-inner { position: relative; max-width: 820px; margin: 0 auto; }
.home-hero-inner > * { animation: homeRise 0.7s ease both; }
.home-hero-inner > *:nth-child(2) { animation-delay: 0.08s; }
.home-hero-inner > *:nth-child(3) { animation-delay: 0.16s; }
.home-hero-inner > *:nth-child(4) { animation-delay: 0.24s; }
.home-hero-inner > *:nth-child(5) { animation-delay: 0.32s; }
.home-hero-inner > *:nth-child(6) { animation-delay: 0.4s; }

.home-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--h-font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  color: var(--h-gold-bright);
  background: rgba(212, 162, 76, 0.07);
  border: 1px solid rgba(212, 162, 76, 0.38);
  border-radius: 9999px;
  padding: 0.45rem 1rem;
}
.home-eyebrow::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--h-gold-bright);
  animation: homeDot 2.4s ease-in-out infinite;
}

.home-hero h1 {
  margin-top: 1.6rem;
  font-size: clamp(2.2rem, 6vw, 4rem);
  line-height: 1.08;
  letter-spacing: -0.025em;
  text-shadow: 0 6px 30px rgba(0, 0, 0, 0.35);
}

.home-hero h1 .home-hl {
  font-style: italic;
  background: linear-gradient(120deg, var(--h-gold-bright) 10%, #F3D58E 50%, var(--h-gold) 90%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.home-hero-sub {
  margin: 1.5rem auto 0;
  max-width: 600px;
  font-size: 1.05rem;
  line-height: 1.75;
  color: rgba(237, 234, 224, 0.78);
}

.home-hero-actions {
  margin-top: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.home-hero-actions .home-btn { padding: 0.85rem 1.7rem; font-size: 0.95rem; }

.home-fact-strip {
  margin: 2.5rem auto 0;
  max-width: 640px;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  justify-content: center;
  font-size: 0.86rem;
  color: rgba(237, 234, 224, 0.72);
  min-height: 1.6rem;
}
.home-fact-strip span { animation: homeFactIn 0.45s ease both; }
.home-fact-strip .fact-icon { color: var(--h-gold-bright); flex-shrink: 0; }

/* ---------- Stats ---------- */
.home-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  max-width: 940px;
  margin: 3.25rem auto 0;
  background: var(--h-line);
  border: 1px solid var(--h-line);
  border-radius: 1.1rem;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}
@media (min-width: 700px) { .home-stats { grid-template-columns: repeat(4, 1fr); } }

.home-stat-cell {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));
  padding: 1.5rem 1rem;
  text-align: center;
  transition: background 0.25s ease, transform 0.25s ease;
}
.home-stat-cell:hover { background: rgba(212, 162, 76, 0.09); }

.home-stat-num {
  font-family: var(--h-font-display);
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 1.1;
  background: linear-gradient(180deg, #F3D58E, var(--h-gold-bright));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--h-gold-bright);
}
.home-stat-label {
  margin-top: 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(237, 234, 224, 0.62);
}

/* ---------- Generic section shell ---------- */
.home-section {
  padding: 5.5rem 1.5rem;
  max-width: 1120px;
  margin: 0 auto;
}

.home-section-head {
  text-align: center;
  max-width: 660px;
  margin: 0 auto 3.25rem;
}

.home-section-eyebrow {
  display: inline-block;
  font-family: var(--h-font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.26em;
  color: var(--h-gold-bright);
}
.home-section-eyebrow::before,
.home-section-eyebrow::after {
  content: '';
  display: inline-block;
  width: 28px;
  height: 1px;
  background: rgba(212, 162, 76, 0.5);
  vertical-align: middle;
  margin: 0 0.8rem;
}

.home-section-head h2 {
  margin-top: 0.8rem;
  font-size: clamp(1.7rem, 4vw, 2.5rem);
  line-height: 1.18;
}

.home-section-head p {
  margin-top: 1rem;
  font-size: 0.98rem;
  line-height: 1.7;
  color: rgba(237, 234, 224, 0.72);
}

/* reveal-on-scroll base (used everywhere via <Reveal>) */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

/* ---------- How it works ---------- */
.home-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  position: relative;
}
@media (min-width: 700px) { .home-steps { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1000px) { .home-steps { grid-template-columns: repeat(4, 1fr); } }

.home-step {
  position: relative;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--h-line);
  border-radius: 1.1rem;
  padding: 1.75rem 1.4rem 1.6rem;
  overflow: hidden;
  transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, background 0.28s ease;
}
.home-step::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--h-gold-bright), transparent);
  transform: scaleX(0.25);
  transform-origin: left;
  transition: transform 0.4s ease;
}
.home-step:hover {
  transform: translateY(-6px);
  border-color: rgba(212, 162, 76, 0.45);
  background: linear-gradient(180deg, rgba(212, 162, 76, 0.1), rgba(255, 255, 255, 0.025));
  box-shadow: 0 22px 44px rgba(0, 0, 0, 0.35);
}
.home-step:hover::before { transform: scaleX(1); }

.home-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  font-family: var(--h-font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--h-gold-bright);
  background: radial-gradient(circle at 30% 30%, rgba(212, 162, 76, 0.28), rgba(184, 134, 58, 0.06));
  border: 1px solid rgba(212, 162, 76, 0.45);
}

.home-step h3 {
  margin-top: 1.1rem;
  font-size: 1.2rem;
}

.home-step p {
  margin-top: 0.6rem;
  font-size: 0.9rem;
  line-height: 1.65;
  color: rgba(237, 234, 224, 0.72);
}

/* ---------- Closing call-to-action (cream card, like the login card) ---------- */
.home-cta-wrap { padding: 0 1.5rem 5.5rem; }

.home-cta {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
  padding: 3rem 2rem;
  text-align: center;
  background: var(--h-paper-card);
  border-radius: 1.5rem;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}
.home-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(500px 220px at 85% -20%, rgba(212, 162, 76, 0.28), transparent 70%),
    radial-gradient(400px 200px at 0% 120%, rgba(47, 107, 79, 0.14), transparent 70%);
  pointer-events: none;
}
.home-cta > * { position: relative; }

.home-page .home-cta h2 {
  color: var(--h-ink);
  font-size: clamp(1.6rem, 3.6vw, 2.3rem);
}
.home-cta p {
  max-width: 520px;
  margin: 0.9rem auto 0;
  font-size: 0.97rem;
  line-height: 1.7;
  color: var(--h-slate);
}
.home-cta-actions {
  margin-top: 1.75rem;
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}
.home-cta-actions .home-btn { padding: 0.8rem 1.6rem; font-size: 0.92rem; }

/* ---------- Footer ---------- */
.home-footer {
  border-top: 1px solid var(--h-line);
  padding: 2.5rem 1.5rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
  font-size: 0.82rem;
  color: rgba(237, 234, 224, 0.6);
  background: rgba(0, 0, 0, 0.18);
}
.home-footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--h-font-display);
  font-size: 1.1rem;
  color: var(--h-white);
}
.home-footer-brand .home-nav-logo { width: 2rem; height: 2rem; }
.home-footer-links { display: flex; gap: 1.5rem; font-weight: 600; }
.home-footer-links a { transition: color 0.2s ease; }
.home-footer-links a:hover { color: var(--h-gold-bright); }

/* ---------- Back to top ---------- */
.home-to-top {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, var(--h-gold-bright), var(--h-gold));
  color: var(--h-ink);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
  opacity: 0;
  transform: translateY(10px) rotate(-90deg);
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 50;
}
.home-to-top.is-shown { opacity: 1; transform: translateY(0) rotate(-90deg); pointer-events: auto; }
.home-to-top.is-shown:hover { transform: translateY(-3px) rotate(-90deg); }

@media (max-width: 520px) {
  .home-nav { padding: 0.75rem 1rem; }
  .home-nav-actions .home-btn { padding: 0.5rem 0.85rem; }
  .home-hero { padding-top: 3.5rem; }
  .home-section { padding: 4rem 1.25rem; }
  .home-cta { padding: 2.25rem 1.25rem; }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero-glow, .home-eyebrow::before, .home-hero-inner > *, .home-fact-strip span { animation: none; }
  .reveal-on-scroll { transition: none; opacity: 1; transform: none; }
  html { scroll-behavior: auto; }
}
`;

export const Home = () => {
  const { categories, candidates, voters, voterHistory } = useVoting();

  const [navScrolled, setNavScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const heroRef = useRef(null);

  // Scroll listener: toggles the sticky-nav background and the
  // back-to-top button once the visitor has scrolled a bit.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavScrolled(y > 24);
      setShowBackToTop(y > 640);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rotate the "quick fact" line under the hero every few seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((i) => (i + 1) % QUICK_FACTS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = useCallback((id) => {
    setMobileMenuOpen(false);
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Derived, live "stats bar" numbers — recomputed only when the
  // underlying voting data actually changes.
  const stats = useMemo(() => {
    const approvedCandidates = candidates.filter((c) => c.status === 'Approved').length;
    const verifiedVoters = voters.filter((v) => v.kycStatus === 'Verified').length;
    return [
      { label: 'Open Categories', value: categories.length },
      { label: 'Approved Candidates', value: approvedCandidates },
      { label: 'Verified Voters', value: verifiedVoters },
      { label: 'Ballots Cast', value: voterHistory.length },
    ];
  }, [categories, candidates, voters, voterHistory]);

  return (
    <div className="home-page">
      <style>{homeCss}</style>

      <header className={`home-nav ${navScrolled ? 'is-scrolled' : ''}`}>
        <Link to="/" className="home-nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <span className="home-nav-logo"><VoteIcon size={20} /></span>
          Votify
        </Link>

        <nav className="home-nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button key={link.id} type="button" onClick={() => scrollToSection(link.id)}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="home-nav-actions">
          <button
            type="button"
            className="home-menu-toggle"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
          <Link to="/login" className="home-btn home-btn-ghost">Login</Link>
          <Link to="/signup" className="home-btn home-btn-solid">Get Started</Link>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="home-mobile-menu">
          {NAV_LINKS.map((link) => (
            <button key={link.id} type="button" onClick={() => scrollToSection(link.id)}>
              {link.label}
            </button>
          ))}
        </div>
      )}

      <main>
        {/* ---------- Hero ---------- */}
        <section className="home-hero" ref={heroRef}>
          <div className="home-hero-glow home-hero-glow-1" aria-hidden="true" />
          <div className="home-hero-glow home-hero-glow-2" aria-hidden="true" />

          <div className="home-hero-inner">
            <span className="home-eyebrow"><SparklesIcon size={12} /> Online Election Platform</span>
            <h1>A voting platform everyone can <span className="home-hl">actually trust.</span></h1>
            <p className="home-hero-sub">
              Votify runs leadership, committee, union, and community elections end-to-end —
              verified voter rolls, candidate applications, live results, and a receipt for every
              ballot cast.
            </p>

            <div className="home-hero-actions">
              <Link to="/signup" className="home-btn home-btn-solid">
                Get Started <ChevronRightIcon size={16} />
              </Link>
              <Link to="/login" className="home-btn home-btn-ghost">Login to your portal</Link>
            </div>

            <div className="home-fact-strip" aria-live="polite">
              <ShieldCheckIcon size={16} className="fact-icon" />
              <span key={factIndex}>{QUICK_FACTS[factIndex]}</span>
            </div>

            <div className="home-stats">
              {stats.map((s) => (
                <div key={s.label} className="home-stat-cell">
                  <div className="home-stat-num">{s.value}</div>
                  <div className="home-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section id="how-it-works" className="home-section">
          <Reveal as="div" className="home-section-head">
            <span className="home-section-eyebrow">How It Works</span>
            <h2>From registration to a verified ballot</h2>
            <p>The same four-step flow every voter, candidate, and admin follows on the platform.</p>
          </Reveal>

          <div className="home-steps">
            {[
              { n: '01', title: 'Register & Verify', desc: 'Sign up as a Voter, Candidate, or Admin. Voters are KYC-checked before they can cast a ballot.' },
              { n: '02', title: 'Browse & Apply', desc: 'Voters browse open categories; candidates apply to a category and wait for Admin approval.' },
              { n: '03', title: 'Cast Your Ballot', desc: 'Pick a candidate, confirm the irreversible vote, and it\'s recorded against that category instantly.' },
              { n: '04', title: 'Get Your Receipt', desc: 'A unique ballot number and verification code are generated for every ballot, viewable anytime.' },
            ].map((step, i) => (
              <Reveal as="div" key={step.n} delay={i * 90} className="home-step">
                <span className="home-step-num">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Closing call-to-action ---------- */}
        <section className="home-cta-wrap">
          <Reveal as="div" className="home-cta">
            <h2>Ready to run a fair election?</h2>
            <p>
              Create your account in a minute and step into your Voter, Candidate, or Admin portal.
            </p>
            <div className="home-cta-actions">
              <Link to="/signup" className="home-btn home-btn-dark">
                Create an account <ChevronRightIcon size={16} />
              </Link>
              <Link to="/login" className="home-btn home-btn-outline-dark">Login</Link>
            </div>
          </Reveal>
        </section>

      </main>

      <footer className="home-footer">
        <div className="home-footer-brand">
          <span className="home-nav-logo"><VoteIcon size={14} /></span>
          Votify
        </div>
        <div className="home-footer-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
          <button type="button" onClick={() => scrollToSection('how-it-works')} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', fontWeight: 600, cursor: 'pointer', padding: 0 }}>How It Works</button>
        </div>
        <div>© 2026 Votify. All rights reserved.</div>
      </footer>

      <button
        type="button"
        className={`home-to-top ${showBackToTop ? 'is-shown' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ChevronRightIcon size={18} />
      </button>
    </div>
  );
};

export default Home;

export const initialCategories = [];

export const initialCandidates = [];

export const initialVoters = [];

export const initialVoterHistory = [];

export const initialAnnouncements = [];

export const initialActivityLogs = [];

export const SEED_VERSION = '2026.08-empty-2';

const VERSION_KEY = 'smartvote_seed_version';

export const ensureFreshSeedData = () => {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  let stored = null;
  try {
    stored = localStorage.getItem(VERSION_KEY);
  } catch {
    return false;
  }

  if (stored === SEED_VERSION) return false;

  const stale = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith('smartvote_')) stale.push(key);
  }
  stale.forEach((key) => localStorage.removeItem(key));
  localStorage.setItem(VERSION_KEY, SEED_VERSION);
  return true;
};

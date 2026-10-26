// Seed data for the app. Everything starts empty: an admin creates the election
// categories, candidates apply and get approved, and voters register themselves
// - nothing is pre-populated and no demo accounts exist.
//
// To load a sample data set for a walkthrough, fill these arrays and bump
// SEED_VERSION below so cached localStorage snapshots are cleared.

export const initialCategories = [];

export const initialCandidates = [];

export const initialVoters = [];

export const initialVoterHistory = [];

export const initialAnnouncements = [];

// Bumping this string wipes every cached `smartvote_*` entry in localStorage
// so the app reseeds from the arrays above on the next load. Bump it whenever
// the seed data changes shape or copy - otherwise browsers that already
// stored the old snapshot keep showing stale (or empty) categories,
// candidates and voters.
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

  // Drop every key this app owns, including the cached demo user, so nothing
  // half-migrated survives the reset.
  const stale = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith('smartvote_')) stale.push(key);
  }
  stale.forEach((key) => localStorage.removeItem(key));
  localStorage.setItem(VERSION_KEY, SEED_VERSION);
  return true;
};

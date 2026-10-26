import { configureStore } from '@reduxjs/toolkit';
import votingReducer, { STORAGE_KEYS } from './votingSlice';
import { ensureFreshSeedData } from '../data/mockData';

// Must run before the store is created: clears stale `smartvote_*` snapshots
// from an older seed version so the store boots with current data.
ensureFreshSeedData();

export const store = configureStore({
  reducer: {
    voting: votingReducer,
  },
});

// Persist each list to localStorage whenever it actually changes (Immer keeps
// unchanged lists referentially equal, so only touched lists are rewritten).
let previous = store.getState().voting;
store.subscribe(() => {
  const current = store.getState().voting;
  Object.entries(STORAGE_KEYS).forEach(([stateKey, storageKey]) => {
    if (current[stateKey] !== previous[stateKey]) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(current[stateKey]));
      } catch (e) {
        console.warn(`Could not save ${storageKey}`, e);
      }
    }
  });
  previous = current;
});

// Make sure every list exists in localStorage after first load.
Object.entries(STORAGE_KEYS).forEach(([stateKey, storageKey]) => {
  try {
    if (localStorage.getItem(storageKey) === null) {
      localStorage.setItem(storageKey, JSON.stringify(previous[stateKey]));
    }
  } catch {
    /* ignore */
  }
});

export default store;

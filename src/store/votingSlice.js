import { createSlice } from '@reduxjs/toolkit';
import {
  initialCategories,
  initialCandidates,
  initialVoters,
  initialVoterHistory,
  initialAnnouncements,
} from '../data/mockData';

// Reads one cached list out of localStorage, falling back to the seed data
// whenever the entry is missing or corrupt.
const loadOrSeed = (key, seed) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return seed;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : seed;
  } catch (e) {
    console.warn(`Could not read ${key} from localStorage; using seed data.`, e);
    return seed;
  }
};

// localStorage key for every list held in this slice (also used by the store
// subscriber in store/index.js to persist changes).
export const STORAGE_KEYS = {
  categories: 'smartvote_categories',
  candidates: 'smartvote_candidates',
  voters: 'smartvote_voters',
  voterHistory: 'smartvote_history',
  announcements: 'smartvote_announcements',
};

export const getInitialVotingState = () => ({
  categories: loadOrSeed(STORAGE_KEYS.categories, initialCategories),
  candidates: loadOrSeed(STORAGE_KEYS.candidates, initialCandidates),
  voters: loadOrSeed(STORAGE_KEYS.voters, initialVoters),
  voterHistory: loadOrSeed(STORAGE_KEYS.voterHistory, initialVoterHistory),
  announcements: loadOrSeed(STORAGE_KEYS.announcements, initialAnnouncements),
});

// Categories cache a candidate count for their cards; recompute it from the
// roster whenever the roster changes so the number never drifts.
const syncCandidateCounts = (state) => {
  state.categories.forEach((cat) => {
    cat.candidatesCount = state.candidates.filter(
      (c) => c.category === cat.name && c.status === 'Approved'
    ).length;
  });
};

const votingSlice = createSlice({
  name: 'voting',
  initialState: getInitialVotingState,
  reducers: {
    // ---- Categories ----
    categoryAdded(state, action) {
      state.categories.unshift(action.payload);
    },
    categoryUpdated(state, action) {
      const { id, data } = action.payload;
      const idx = state.categories.findIndex((c) => c.id === id);
      if (idx !== -1) state.categories[idx] = { ...state.categories[idx], ...data };
    },
    categoryDeleted(state, action) {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
    },

    // ---- Candidates ----
    candidateApproved(state, action) {
      const cand = state.candidates.find((c) => c.id === action.payload);
      if (cand) cand.status = 'Approved';
      syncCandidateCounts(state);
    },
    candidateRejected(state, action) {
      const { id, reason } = action.payload;
      const cand = state.candidates.find((c) => c.id === id);
      if (cand) {
        cand.status = 'Rejected';
        cand.rejectionReason = reason || 'Application did not meet election requirements.';
      }
      syncCandidateCounts(state);
    },
    candidateApplied(state, action) {
      state.candidates.unshift(action.payload);
    },
    campaignUpdated(state, action) {
      const { id, data } = action.payload;
      const idx = state.candidates.findIndex((c) => c.id === id);
      if (idx !== -1) state.candidates[idx] = { ...state.candidates[idx], ...data };
    },

    // ---- Voters ----
    voterRegistered(state, action) {
      state.voters.unshift(action.payload);
    },
    voterApproved(state, action) {
      const voter = state.voters.find((v) => v.id === action.payload);
      if (voter) {
        voter.kycStatus = 'Verified';
        delete voter.rejectionReason;
      }
    },
    voterRejected(state, action) {
      const { id, reason } = action.payload;
      const voter = state.voters.find((v) => v.id === id);
      if (voter) {
        voter.kycStatus = 'Rejected';
        voter.rejectionReason =
          reason || 'Identity documents did not meet registry requirements.';
      }
    },
    voterBlockToggled(state, action) {
      const voter = state.voters.find((v) => v.id === action.payload);
      if (voter) voter.accountStatus = voter.accountStatus === 'Active' ? 'Blocked' : 'Active';
    },

    // ---- Voting ----
    // One reducer updates every list a ballot touches, so the vote, the
    // category total, the voter's history and the voter's status can never
    // get out of sync.
    voteCast(state, action) {
      const { categoryName, candidateId, historyEntry, voterId, voterEmail } = action.payload;

      const cand = state.candidates.find((c) => c.id === candidateId);
      if (cand) cand.votes = (cand.votes || 0) + 1;

      const cat = state.categories.find((c) => c.name === categoryName);
      if (cat) cat.totalVotes = (cat.totalVotes || 0) + 1;

      state.voterHistory.unshift(historyEntry);

      state.voters.forEach((v) => {
        if (v.id === voterId || (voterEmail && v.email === voterEmail)) {
          v.votingStatus = 'Voted';
          v.votesCast = (v.votesCast || 0) + 1;
        }
      });
    },

    // ---- Announcements ----
    announcementAdded(state, action) {
      state.announcements.unshift(action.payload);
    },
    announcementDeleted(state, action) {
      state.announcements = state.announcements.filter((a) => a.id !== action.payload);
    },
  },
});

export const {
  categoryAdded,
  categoryUpdated,
  categoryDeleted,
  candidateApproved,
  candidateRejected,
  candidateApplied,
  campaignUpdated,
  voterRegistered,
  voterApproved,
  voterRejected,
  voterBlockToggled,
  voteCast,
  announcementAdded,
  announcementDeleted,
} = votingSlice.actions;

export default votingSlice.reducer;

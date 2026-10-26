import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
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
} from '../store/votingSlice';

// ===================== Auth =====================

const AuthContext = createContext();

// Registered accounts live in localStorage under this key. Only people who
// signed up here can log in - there are no demo or pre-seeded accounts.
const ACCOUNTS_KEY = 'smartvote_accounts';

const loadAccounts = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveAccounts = (accounts) => {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Could not save accounts', e);
  }
};

const normalizeEmail = (email = '') => email.trim().toLowerCase();

// Passwords are never stored in plain text: each account keeps a random salt
// and a SHA-256 hash of salt + password. (This is still a front-end-only demo;
// a real deployment must verify credentials on a server.)
const randomSalt = () => {
  const bytes = new Uint8Array(16);
  (globalThis.crypto || window.crypto).getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};

const hashPassword = async (password, salt) => {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await (globalThis.crypto || window.crypto).subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
};

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const AuthProvider = ({ children }) => {
  // Nobody is signed in until they log in or register.
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smartvote_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // A saved session only counts while its account still exists.
        const stillRegistered = loadAccounts().some((acc) => acc.id === parsed.id);
        return stillRegistered ? parsed : null;
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('smartvote_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('smartvote_user');
    }
  }, [currentUser]);

  // No-op: the toast popup UI has been removed, but call sites across the
  // app still call addToast(), so it stays as a harmless stub.
  const addToast = () => {};

  // Signs an existing account in. Resolves to { user } on success or
  // { error, field } when the email is unknown, the role tab is wrong, or the
  // password does not match.
  const login = async (role, email, password) => {
    const account = loadAccounts().find((acc) => acc.email === normalizeEmail(email));

    if (!account) {
      return { field: 'email', error: 'No account found with this email. Please sign up first.' };
    }
    if (account.role !== role) {
      return {
        field: 'email',
        error: `This email is registered as a ${account.role}. Switch to the ${capitalize(account.role)} tab to log in.`,
      };
    }

    const hash = await hashPassword(password, account.salt);
    if (hash !== account.passwordHash) {
      return { field: 'password', error: 'Incorrect password. Please try again.' };
    }

    setCurrentUser(account.profile);
    return { user: account.profile };
  };

  // Creates a new account and signs it in. Resolves to { user } or, when the
  // email is already taken, { error, field }.
  const signup = async (role, formData) => {
    const email = normalizeEmail(formData.email);
    const accounts = loadAccounts();

    if (accounts.some((acc) => acc.email === email)) {
      return { field: 'email', error: 'An account with this email already exists. Please log in instead.' };
    }

    // The profile is persisted to localStorage, so never carry the credentials
    // into it - drop them before the profile is built.
    const { password, confirmPassword: _cpw, adminCode: _code, ...profileData } = formData;

    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.fullName || formData.name || 'New User',
      email,
      phone: formData.phone || '',
      role,
      joinedDate: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      ...profileData,
    };
    newUser.email = email;

    if (role === 'candidate') {
      newUser.applicationStatus = 'Pending';
    }

    const salt = randomSalt();
    const passwordHash = await hashPassword(password, salt);

    saveAccounts([
      ...accounts,
      { id: newUser.id, email, role, salt, passwordHash, profile: newUser },
    ]);

    setCurrentUser(newUser);
    return { user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedData) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updatedData };
      // Keep the stored account in step so the changes survive the next login.
      saveAccounts(loadAccounts().map((acc) => (acc.id === prev.id ? { ...acc, profile: next } : acc)));
      return next;
    });
  };

  const role = currentUser?.role || null;
  const isAuthenticated = Boolean(currentUser);

  return (
    <AuthContext.Provider value={{
      user: currentUser,
      role,
      isAuthenticated,
      login,
      signup,
      logout,
      updateProfile,
      addToast
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ===================== Theme =====================

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Light mode only: the dark theme and the toggle were removed.
  useEffect(() => {
    localStorage.removeItem('smartvote_theme');
    const root = document.documentElement;
    root.setAttribute('data-theme', 'light');
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ===================== Voting (Redux Toolkit) =====================
//
// Categories, candidates, voters, ballots, announcements and logs live in the
// Redux store (src/store). `useVoting()` keeps the exact same API the pages
// already use, but reads state with useSelector and writes with dispatch.

export const useVoting = () => {
  const dispatch = useDispatch();
  const { user, addToast } = useAuth();

  const categories = useSelector((s) => s.voting.categories);
  const candidates = useSelector((s) => s.voting.candidates);
  const voters = useSelector((s) => s.voting.voters);
  const voterHistory = useSelector((s) => s.voting.voterHistory);
  const announcements = useSelector((s) => s.voting.announcements);

  // Category Actions
  const addCategory = (categoryData) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      candidatesCount: 0,
      totalVotes: 0,
      status: 'Active',
      ...categoryData,
    };
    dispatch(categoryAdded(newCategory));
    addToast(`Category "${newCategory.name}" created successfully!`, 'success');
  };

  const updateCategory = (id, updatedData) => {
    dispatch(categoryUpdated({ id, data: updatedData }));
    addToast('Category updated successfully!', 'success');
  };

  const deleteCategory = (id) => {
    dispatch(categoryDeleted(id));
    addToast('Category removed successfully.', 'info');
  };

  // Candidate Actions
  const approveCandidate = (candidateId) => {
    const cand = candidates.find((c) => c.id === candidateId);
    dispatch(candidateApproved(candidateId));
    addToast(`Candidacy for ${cand ? cand.name : 'candidate'} has been approved!`, 'success');
  };

  const rejectCandidate = (candidateId, reason) => {
    const cand = candidates.find((c) => c.id === candidateId);
    dispatch(candidateRejected({ id: candidateId, reason }));
    addToast(`Candidacy rejected for ${cand ? cand.name : 'candidate'}.`, 'warning');
  };

  const applyForCategory = (applicationData) => {
    const newCandidate = {
      id: `cand-${Date.now()}`,
      status: 'Pending',
      votes: 0,
      appliedDate: new Date().toISOString().split('T')[0],
      ...applicationData,
    };
    dispatch(candidateApplied(newCandidate));
    addToast('Application submitted! It will be reviewed by Admin.', 'info', 'Submitted');
    return newCandidate;
  };

  const updateCandidateCampaign = (candidateId, campaignData) => {
    dispatch(campaignUpdated({ id: candidateId, data: campaignData }));
    addToast('Campaign details updated successfully!', 'success');
  };

  // Voter Actions
  // A voter joins the roll as 'Pending' and needs an admin KYC decision before
  // their ballot counts - the same approve/reject flow candidates go through.
  const registerVoter = (voterData) => {
    const alreadyOnRoll = voters.some(
      (v) => v.email && voterData.email && v.email.toLowerCase() === voterData.email.toLowerCase()
    );
    if (alreadyOnRoll) return null;

    const newVoter = {
      id: `vot-${Date.now()}`,
      name: voterData.name || 'Unnamed Voter',
      email: voterData.email || '',
      phone: voterData.phone || '',
      dob: voterData.dob || '',
      voterId: voterData.voterId || `SV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      department: voterData.department || '',
      kycStatus: 'Pending',
      votingStatus: 'Not Voted',
      accountStatus: 'Active',
      registeredDate: new Date().toISOString().split('T')[0],
      votesCast: 0,
    };

    dispatch(voterRegistered(newVoter));
    return newVoter;
  };

  const approveVoter = (voterId) => {
    const voter = voters.find((v) => v.id === voterId);
    dispatch(voterApproved(voterId));
    addToast(`${voter ? voter.name : 'Voter'} has been KYC verified.`, 'success');
  };

  const rejectVoter = (voterId, reason) => {
    const voter = voters.find((v) => v.id === voterId);
    dispatch(voterRejected({ id: voterId, reason }));
    addToast(`KYC rejected for ${voter ? voter.name : 'voter'}.`, 'warning');
  };

  const toggleVoterBlock = (voterId) => {
    dispatch(voterBlockToggled(voterId));
    addToast('Voter account status updated.', 'info');
  };

  const hasVotedCategory = (categoryName) => {
    return voterHistory.some((item) => item.category === categoryName);
  };

  // Vote Cast Action
  const castVote = (categoryName, candidate) => {
    // Ballot numbers run in order for the election year, and the verification
    // code is a plain 12-digit number the voter can read out over the phone.
    const ballotNumber = `${new Date().getFullYear()}-${String(voterHistory.length + 1).padStart(4, '0')}`;
    const verificationCode = Array.from({ length: 3 }, () => String(Math.floor(1000 + Math.random() * 9000))).join(' ');

    const historyEntry = {
      id: `hist-${Date.now()}`,
      category: categoryName,
      candidate: candidate.name,
      date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      receiptId: ballotNumber,
      status: 'Verified',
      verificationCode,
    };

    dispatch(voteCast({
      categoryName,
      candidateId: candidate.id,
      historyEntry,
      voterId: user?.id,
      voterEmail: user?.email,
    }));


    return { receiptId: ballotNumber, verificationCode, historyEntry };
  };

  // Announcements
  const addAnnouncement = (annData) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: user?.name || 'Election Admin',
      ...annData,
    };
    dispatch(announcementAdded(newAnn));
    addToast('Announcement posted to all portals!', 'success');
  };

  const deleteAnnouncement = (id) => {
    dispatch(announcementDeleted(id));
    addToast('Announcement removed.', 'info');
  };

  return {
    categories,
    candidates,
    voters,
    voterHistory,
    announcements,
    addCategory,
    updateCategory,
    deleteCategory,
    approveCandidate,
    rejectCandidate,
    applyForCategory,
    updateCandidateCampaign,
    registerVoter,
    approveVoter,
    rejectVoter,
    toggleVoterBlock,
    hasVotedCategory,
    castVote,
    addAnnouncement,
    deleteAnnouncement,
  };
};

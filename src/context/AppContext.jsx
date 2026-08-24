import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCategories,
  initialCandidates,
  initialVoters,
  initialVoterHistory,
  initialAnnouncements,
  initialActivityLogs
} from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smartvote_user');
    if (saved) {
      try {
        return JSON.parse(saved);
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

  const addToast = () => {};

  const login = (role, email, password) => {
    const matchedUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: role,
      joinedDate: 'August 2026',
    };
    setCurrentUser(matchedUser);
    addToast(`Logged in successfully as ${role.toUpperCase()}`, 'success', 'Welcome Back');
    return matchedUser;
  };

  const signup = (role, formData) => {
    const { password: _pw, confirmPassword: _cpw, adminCode: _code, ...profileData } = formData;

    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.fullName || formData.name || 'New User',
      email: formData.email,
      phone: formData.phone || '+91 98000 00000',
      role: role,
      joinedDate: 'August 2026',
      ...profileData
    };

    if (role === 'candidate') {
      newUser.applicationStatus = 'Pending';
      addToast('Application submitted! It will be reviewed by the Admin.', 'info', 'Review Pending');
    } else {
      addToast(`Account created successfully as ${role.toUpperCase()}!`, 'success', 'Account Registered');
    }

    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('You have been logged out.', 'info', 'Session Ended');
  };

  const switchRole = (newRole) => {
    setCurrentUser(prev => (prev ? { ...prev, role: newRole } : prev));
  };

  const updateProfile = (updatedData) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedData
    }));
    addToast('Profile information updated successfully!', 'success', 'Saved');
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
      switchRole,
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

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('smartvote_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('smartvote_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
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

const VotingContext = createContext();

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

export const VotingProvider = ({ children }) => {
  const { user, addToast } = useAuth();

  const [categories, setCategories] = useState(() => loadOrSeed('smartvote_categories', initialCategories));
  const [candidates, setCandidates] = useState(() => loadOrSeed('smartvote_candidates', initialCandidates));
  const [voters, setVoters] = useState(() => loadOrSeed('smartvote_voters', initialVoters));
  const [voterHistory, setVoterHistory] = useState(() => loadOrSeed('smartvote_history', initialVoterHistory));
  const [announcements, setAnnouncements] = useState(() => loadOrSeed('smartvote_announcements', initialAnnouncements));
  const [activityLogs, setActivityLogs] = useState(() => loadOrSeed('smartvote_logs', initialActivityLogs));

  useEffect(() => {
    localStorage.setItem('smartvote_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('smartvote_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('smartvote_voters', JSON.stringify(voters));
  }, [voters]);

  useEffect(() => {
    localStorage.setItem('smartvote_history', JSON.stringify(voterHistory));
  }, [voterHistory]);

  useEffect(() => {
    localStorage.setItem('smartvote_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('smartvote_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const logActivity = (action, details, status = 'Success') => {
    const newLog = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      action,
      user: user ? `${user.name} (${user.role.toUpperCase()})` : 'System',
      details,
      timestamp: new Date().toLocaleString(),
      status
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const addCategory = (categoryData) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      candidatesCount: 0,
      totalVotes: 0,
      status: 'Active',
      ...categoryData
    };
    setCategories(prev => [newCategory, ...prev]);
    logActivity('Category Created', `Created category: ${newCategory.name}`);
    addToast(`Category "${newCategory.name}" created successfully!`, 'success');
  };

  const updateCategory = (id, updatedData) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
    logActivity('Category Updated', `Updated category ID: ${id}`);
    addToast('Category updated successfully!', 'success');
  };

  const deleteCategory = (id) => {
    const cat = categories.find(c => c.id === id);
    setCategories(prev => prev.filter(c => c.id !== id));
    logActivity('Category Deleted', `Deleted category: ${cat ? cat.name : id}`, 'Warning');
    addToast('Category removed successfully.', 'info');
  };

  const syncCandidateCounts = (candidateList) => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      candidatesCount: candidateList.filter(c => c.category === cat.name && c.status === 'Approved').length,
    })));
  };

  const approveCandidate = (candidateId) => {
    setCandidates(prev => {
      const next = prev.map(c => (c.id === candidateId ? { ...c, status: 'Approved' } : c));
      syncCandidateCounts(next);
      return next;
    });
    const cand = candidates.find(c => c.id === candidateId);
    logActivity('Candidate Approved', `Approved application for ${cand ? cand.name : candidateId}`);
    addToast(`Candidacy for ${cand ? cand.name : 'candidate'} has been approved!`, 'success');
  };

  const rejectCandidate = (candidateId, reason) => {
    setCandidates(prev => {
      const next = prev.map(c => (
        c.id === candidateId
          ? { ...c, status: 'Rejected', rejectionReason: reason || 'Application did not meet election requirements.' }
          : c
      ));
      syncCandidateCounts(next);
      return next;
    });
    const cand = candidates.find(c => c.id === candidateId);
    logActivity('Candidate Rejected', `Rejected ${cand ? cand.name : candidateId} - Reason: ${reason}`, 'Warning');
    addToast(`Candidacy rejected for ${cand ? cand.name : 'candidate'}.`, 'warning');
  };

  const applyForCategory = (applicationData) => {
    const newCandidate = {
      id: `cand-${Date.now()}`,
      status: 'Pending',
      votes: 0,
      appliedDate: new Date().toISOString().split('T')[0],
      ...applicationData
    };
    setCandidates(prev => [newCandidate, ...prev]);
    logActivity('Candidate Application', `Applied for ${newCandidate.category}`);
    addToast('Application submitted! It will be reviewed by Admin.', 'info', 'Submitted');
    return newCandidate;
  };

  const updateCandidateCampaign = (candidateId, campaignData) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, ...campaignData } : c));
    logActivity('Campaign Updated', `Updated manifesto & symbol for candidate ${candidateId}`);
    addToast('Campaign details updated successfully!', 'success');
  };

  const registerVoter = (voterData) => {
    const alreadyOnRoll = voters.some(v => v.email && voterData.email && v.email.toLowerCase() === voterData.email.toLowerCase());
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

    setVoters(prev => [newVoter, ...prev]);
    logActivity('Voter Registered', `${newVoter.name} joined the roll as ${newVoter.voterId} - awaiting KYC`);
    return newVoter;
  };

  const approveVoter = (voterId) => {
    setVoters(prev => prev.map(v => (
      v.id === voterId ? { ...v, kycStatus: 'Verified', rejectionReason: undefined } : v
    )));
    const voter = voters.find(v => v.id === voterId);
    logActivity('Voter Approved', `KYC cleared for ${voter ? voter.name : voterId}`);
    addToast(`${voter ? voter.name : 'Voter'} has been KYC verified.`, 'success');
  };

  const rejectVoter = (voterId, reason) => {
    setVoters(prev => prev.map(v => (
      v.id === voterId
        ? { ...v, kycStatus: 'Rejected', rejectionReason: reason || 'Identity documents did not meet registry requirements.' }
        : v
    )));
    const voter = voters.find(v => v.id === voterId);
    logActivity('Voter Rejected', `KYC rejected for ${voter ? voter.name : voterId} - Reason: ${reason}`, 'Warning');
    addToast(`KYC rejected for ${voter ? voter.name : 'voter'}.`, 'warning');
  };

  const toggleVoterBlock = (voterId) => {
    setVoters(prev => prev.map(v => {
      if (v.id === voterId) {
        const newStatus = v.accountStatus === 'Active' ? 'Blocked' : 'Active';
        logActivity('Voter Status Changed', `${v.name} status updated to ${newStatus}`);
        return { ...v, accountStatus: newStatus };
      }
      return v;
    }));
    addToast('Voter account status updated.', 'info');
  };

  const hasVotedCategory = (categoryName) => {
    return voterHistory.some(item => item.category === categoryName);
  };

  const castVote = (categoryName, candidate) => {
    const ballotNumber = `${new Date().getFullYear()}-${String(voterHistory.length + 1).padStart(4, '0')}`;
    const verificationCode = Array.from({ length: 3 }, () => String(Math.floor(1000 + Math.random() * 9000))).join(' ');

    setCandidates(prev => prev.map(c => {
      if (c.id === candidate.id) {
        return { ...c, votes: (c.votes || 0) + 1 };
      }
      return c;
    }));

    setCategories(prev => prev.map(cat => {
      if (cat.name === categoryName) {
        return { ...cat, totalVotes: (cat.totalVotes || 0) + 1 };
      }
      return cat;
    }));

    const historyEntry = {
      id: `hist-${Date.now()}`,
      category: categoryName,
      candidate: candidate.name,
      date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      receiptId: ballotNumber,
      status: 'Verified',
      verificationCode
    };
    setVoterHistory(prev => [historyEntry, ...prev]);

    logActivity('Vote Cast', `Voted in category "${categoryName}" for candidate "${candidate.name}"`);

    setVoters(prev => prev.map(v => {
      if (v.id === user?.id || v.email === user?.email) {
        return { ...v, votingStatus: 'Voted', votesCast: (v.votesCast || 0) + 1 };
      }
      return v;
    }));

    return { receiptId: ballotNumber, verificationCode, historyEntry };
  };

  const addAnnouncement = (annData) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: user?.name || 'Election Admin',
      ...annData
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logActivity('Announcement Posted', `Published: ${newAnn.title}`);
    addToast('Announcement posted to all portals!', 'success');
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addToast('Announcement removed.', 'info');
  };

  return (
    <VotingContext.Provider value={{
      categories,
      candidates,
      voters,
      voterHistory,
      announcements,
      activityLogs,
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
      logActivity
    }}>
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};

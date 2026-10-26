import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { AppLayout } from '../components/layout/Chrome';
import { useAuth } from '../context/AppContext';

// Public Pages
import Home from '../pages/Home';
import AuthPage from '../pages/auth/AuthPage';
import CandidatePublic from '../pages/CandidatePublic';
import NotFound from '../pages/NotFound';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminCandidates from '../pages/admin/AdminCandidates';
import AdminVoters from '../pages/admin/AdminVoters';
import AdminResults from '../pages/admin/AdminResults';
import AdminAnnouncements from '../pages/admin/AdminAnnouncements';
import AdminProfile from '../pages/admin/AdminProfile';

// Candidate Pages
import CandidateDashboard from '../pages/candidate/CandidateDashboard';
import CandidateApply from '../pages/candidate/CandidateApply';
import CandidateCampaign from '../pages/candidate/CandidateCampaign';
import CandidateVotes from '../pages/candidate/CandidateVotes';
import CandidateResults from '../pages/candidate/CandidateResults';
import CandidateProfile from '../pages/candidate/CandidateProfile';

// Voter Pages
import VoterDashboard from '../pages/voter/VoterDashboard';
import VoterCategories from '../pages/voter/VoterCategories';
import VoterHistory from '../pages/voter/VoterHistory';
import VoterResults from '../pages/voter/VoterResults';
import VoterProfile from '../pages/voter/VoterProfile';

// Blocks a nested portal route unless the signed-in user has one of the
// allowed roles, bouncing them to their own dashboard instead (or to
// /login if signed out entirely).
const RoleRoute = ({ allowedRoles = [], children }) => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'candidate') return <Navigate to="/candidate/dashboard" replace />;
    return <Navigate to="/voter/dashboard" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing & Authentication Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />

      {/* Public dynamic route: /candidates/:candidateId (route params demo) */}
      <Route path="/candidates/:candidateId" element={<CandidatePublic />} />

      {/* Admin Portal Nested Routes */}
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AppLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="candidates" element={<AdminCandidates />} />
        <Route path="voters" element={<AdminVoters />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Candidate Portal Nested Routes */}
      <Route
        path="/candidate"
        element={
          <RoleRoute allowedRoles={['candidate']}>
            <AppLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/candidate/dashboard" replace />} />
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="apply" element={<CandidateApply />} />
        <Route path="campaign" element={<CandidateCampaign />} />
        <Route path="votes" element={<CandidateVotes />} />
        <Route path="results" element={<CandidateResults />} />
        <Route path="profile" element={<CandidateProfile />} />
      </Route>

      {/* Voter Portal Nested Routes */}
      <Route
        path="/voter"
        element={
          <RoleRoute allowedRoles={['voter']}>
            <AppLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/voter/dashboard" replace />} />
        <Route path="dashboard" element={<VoterDashboard />} />
        <Route path="categories" element={<VoterCategories />} />
        <Route path="history" element={<VoterHistory />} />
        <Route path="results" element={<VoterResults />} />
        <Route path="profile" element={<VoterProfile />} />
      </Route>

      {/* 404 Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

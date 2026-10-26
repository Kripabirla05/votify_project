import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { NotificationDropdown, ProfileDropdown } from '../common/ProfileNav';
import { useAuth } from '../../context/AppContext';
import {
  VoteIcon,
  DashboardIcon,
  CategoryIcon,
  CandidateIcon,
  UsersIcon,
  ResultsIcon,
  BellIcon,
  UserIcon,
  HistoryIcon,
  CampaignIcon,
  ApplyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogoutIcon,
  MenuIcon
} from '../../assets/icons';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { section: 'Overview' },
          { to: '/admin/dashboard', icon: DashboardIcon, label: 'Dashboard' },
          { to: '/admin/categories', icon: CategoryIcon, label: 'Categories' },
          { to: '/admin/candidates', icon: CandidateIcon, label: 'Candidates' },
          { to: '/admin/voters', icon: UsersIcon, label: 'Voters' },
          { section: 'Analytics' },
          { to: '/admin/results', icon: ResultsIcon, label: 'Election Results' },
          { to: '/admin/announcements', icon: BellIcon, label: 'Announcements' },
          { section: 'Management' },
          { to: '/admin/profile', icon: UserIcon, label: 'Admin Profile' },
        ];
      case 'candidate':
        return [
          { section: 'Overview' },
          { to: '/candidate/dashboard', icon: DashboardIcon, label: 'Dashboard' },
          { to: '/candidate/apply', icon: ApplyIcon, label: 'Apply Category' },
          { to: '/candidate/campaign', icon: CampaignIcon, label: 'My Campaign' },
          { section: 'Analytics' },
          { to: '/candidate/votes', icon: VoteIcon, label: 'Vote Count' },
          { to: '/candidate/results', icon: ResultsIcon, label: 'Results' },
          { section: 'Account' },
          { to: '/candidate/profile', icon: UserIcon, label: 'Profile' },
        ];
      case 'voter':
      default:
        return [
          { section: 'Overview' },
          { to: '/voter/dashboard', icon: DashboardIcon, label: 'Dashboard' },
          { to: '/voter/categories', icon: CategoryIcon, label: 'Active Elections' },
          { section: 'Records' },
          { to: '/voter/history', icon: HistoryIcon, label: 'Voting History' },
          { to: '/voter/results', icon: ResultsIcon, label: 'Live Results' },
          { section: 'Account' },
          { to: '/voter/profile', icon: UserIcon, label: 'Voter Profile' },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <NavLink to={`/${role || 'voter'}/dashboard`} className="sidebar-brand">
          <div className="brand-icon">
            <VoteIcon size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Votify</span>
            <span className="brand-role-tag">{role || 'Voter'} Portal</span>
          </div>
        </NavLink>
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
        </button>
      </div>

      <div className="sidebar-content">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div key={`sec-${idx}`} className="sidebar-nav-section">
                {item.section}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon size={20} />
              <span className="nav-text">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
          <LogoutIcon size={18} />
          <span className="logout-text">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export const Topbar = ({ onToggleMobileMenu }) => {
  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-trigger"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon size={22} />
        </button>
      </div>

      <div className="topbar-right">
        <NotificationDropdown />

        <ProfileDropdown />
      </div>
    </header>
  );
};

export const BottomNav = () => {
  const { role } = useAuth();

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: DashboardIcon, label: 'Dash' },
          { to: '/admin/categories', icon: CategoryIcon, label: 'Categories' },
          { to: '/admin/candidates', icon: CandidateIcon, label: 'Candidates' },
          { to: '/admin/results', icon: ResultsIcon, label: 'Results' },
          { to: '/admin/profile', icon: UserIcon, label: 'Profile' },
        ];
      case 'candidate':
        return [
          { to: '/candidate/dashboard', icon: DashboardIcon, label: 'Dash' },
          { to: '/candidate/apply', icon: ApplyIcon, label: 'Apply' },
          { to: '/candidate/campaign', icon: CampaignIcon, label: 'Campaign' },
          { to: '/candidate/votes', icon: VoteIcon, label: 'Votes' },
          { to: '/candidate/profile', icon: UserIcon, label: 'Profile' },
        ];
      case 'voter':
      default:
        return [
          { to: '/voter/dashboard', icon: DashboardIcon, label: 'Dash' },
          { to: '/voter/categories', icon: CategoryIcon, label: 'Elections' },
          { to: '/voter/history', icon: HistoryIcon, label: 'History' },
          { to: '/voter/results', icon: ResultsIcon, label: 'Results' },
          { to: '/voter/profile', icon: UserIcon, label: 'Profile' },
        ];
    }
  };

  const links = getLinks();

  return (
    <nav className="mobile-bottom-nav">
      <ul className="bottom-nav-list">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <li key={link.to} className="bottom-nav-item">
              <NavLink
                to={link.to}
                className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// Sidebar/Topbar/BottomNav all derive their nav items from the signed-in
// role via context, not props - so admin/candidate/voter never needed
// separate layout components, just this one shell reused across all three.
export const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="app-layout-wrapper">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="app-main-viewport">
        <Topbar onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="page-content-container">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

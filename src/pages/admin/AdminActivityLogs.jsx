import React, { useState } from 'react';
import { SearchBar } from '../../components/common/FormFields';
import { StatusBadge, EmptyState } from '../../components/common/UI';
import { useVoting } from '../../context/AppContext';
import { ActivityIcon, DownloadIcon } from '../../assets/icons';

const AdminActivityLogs = () => {
  const { activityLogs } = useVoting();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = activityLogs.filter(log => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(search) ||
      log.user.toLowerCase().includes(search) ||
      log.details.toLowerCase().includes(search);

    return matchesSearch &&
      (statusFilter === 'ALL' || log.status === statusFilter);
  });

  const handleExportCSV = () =>
    alert('Simulated export: activity_logs_audit_trail.csv downloaded.');

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <ActivityIcon size={30} style={{ color: 'var(--primary)' }} />
            System Audit Trail & Activity Logs
          </h1>
          <p>Immutable log of every ballot submitted, category created, and admin decision.</p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <DownloadIcon size={18} />
            Export Audit Trail (CSV)
          </button>
        </div>
      </div>

      <div className="filter-toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Filter by action, user, or details..."
          style={{ width: '320px' }}
        />

        <select
          className="form-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ width: '160px' }}
        >
          <option value="ALL">All Outcomes</option>
          <option value="Success">Success</option>
          <option value="Warning">Warning</option>
          <option value="Danger">Failure</option>
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <EmptyState
          title="No Logs Recorded"
          description="No system activity events match the selected search criteria."
        />
      ) : (
        <div className="dashboard-panel">
          <div className="table-responsive-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Action</th>
                  <th>User / Entity</th>
                  <th>Details & Context</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td><strong>{log.action}</strong></td>
                    <td>{log.user}</td>
                    <td>{log.details}</td>
                    <td>{log.timestamp}</td>
                    <td><StatusBadge status={log.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLogs;
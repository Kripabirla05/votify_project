import React, { useState } from 'react';
import { Modal } from '../../components/common/Modals';
import { InputField } from '../../components/common/FormFields';
import { StatusBadge, EmptyState } from '../../components/common/UI';
import { useVoting } from '../../context/AppContext';
import { BellIcon, PlusIcon, TrashIcon } from '../../assets/icons';

export const AdminAnnouncements = () => {
  const { announcements, addAnnouncement, deleteAnnouncement } = useVoting();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'Medium',
    author: 'Chief Election Commissioner'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    addAnnouncement(formData);
    setFormData({ title: '', content: '', priority: 'Medium', author: 'Chief Election Commissioner' });
    setIsAddOpen(false);
  };

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <BellIcon size={30} style={{ color: 'var(--primary)' }} />
            System Broadcasts & Announcements
          </h1>
          <p>Publish election bulletins, deadlines, guideline notices, and live town hall alerts.</p>
        </div>

        <div className="page-header-actions">
          <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
            <PlusIcon size={18} />
            Post Announcement
          </button>
        </div>
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          title="No Active Announcements"
          description="There are currently no broadcasts active on the system."
          actionText="Create Announcement"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {announcements.map((ann) => (
            <div key={ann.id} className="dashboard-panel" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>{ann.title}</h3>
                    <StatusBadge status={ann.priority} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Posted by {ann.author} • {ann.date}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-outline btn-icon btn-sm"
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                  onClick={() => deleteAnnouncement(ann.id)}
                  title="Delete Announcement"
                >
                  <TrashIcon size={16} />
                </button>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Announcement Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Post New Election Bulletin"
        subtitle="This announcement will be pushed to voter and candidate portals."
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Publish Broadcast</button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <InputField
            label="Announcement Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Presidential Town Hall Tomorrow at 4 PM"
            required
          />

          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="High">High (Urgent Alert)</option>
              <option value="Medium">Medium (General Update)</option>
              <option value="Low">Low (Informational)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Announcement Content <span className="req">*</span></label>
            <textarea
              className="form-textarea"
              rows="4"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write the full announcement bulletin for voters and candidates..."
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAnnouncements;

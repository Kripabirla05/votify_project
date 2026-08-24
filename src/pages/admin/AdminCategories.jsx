import React, { useState } from 'react';
import { CategoryCard } from '../../components/common/Cards';
import { AddCategoryModal } from '../../components/admin/AdminModals';
import { SearchBar } from '../../components/common/FormFields';
import { EmptyState } from '../../components/common/UI';
import { useVoting } from '../../context/AppContext';
import { CategoryIcon, PlusIcon } from '../../assets/icons';

export const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useVoting();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
  };

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <CategoryIcon size={30} style={{ color: 'var(--primary)' }} />
            Election Categories & Posts
          </h1>
          <p>Manage electoral posts, voting time windows, and nominee qualifications.</p>
        </div>

        <div className="page-header-actions">
          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <PlusIcon size={18} />
            Add New Category
          </button>
        </div>
      </div>

      
      <div className="filter-toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Filter categories..."
          style={{ width: '300px' }}
        />

        <div className="filter-group">
          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('grid')}
            >
              Card Grid
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description="No election categories matched your filter criteria."
          actionText="Create Category"
          onAction={handleOpenAdd}
        />
      ) : viewMode === 'grid' ? (
        <div className="cards-grid">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              role="admin"
              onEdit={handleOpenEdit}
              onDelete={deleteCategory}
            />
          ))}
        </div>
      ) : (
        <div className="dashboard-panel">
          <div className="table-responsive-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Status</th>
                  <th>Candidates</th>
                  <th>Votes Cast</th>
                  <th>Start Window</th>
                  <th>End Window</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <strong>{cat.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {cat.description.substring(0, 50)}...
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${cat.status.toLowerCase()}`}>
                        {cat.status}
                      </span>
                    </td>
                    <td>{cat.candidatesCount || 0}</td>
                    <td>{cat.totalVotes || 0}</td>
                    <td><small>{cat.startDate?.replace('T', ' ')}</small></td>
                    <td><small>{cat.endDate?.replace('T', ' ')}</small></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(cat)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)' }}
                          onClick={() => deleteCategory(cat.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCategory}
      />
    </div>
  );
};

export default AdminCategories;

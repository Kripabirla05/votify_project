import React, { useState } from 'react';
import { CategoryCard } from '../../components/common/Cards';
import { ApplyModal } from '../../components/voting/VotingModals';
import { SearchBar } from '../../components/common/FormFields';
import { EmptyState } from '../../components/common/UI';
import { useVoting } from '../../context/AppContext';
import { ApplyIcon } from '../../assets/icons';

export const CandidateApply = () => {
  const { categories } = useVoting();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenApply = (cat) => {
    setSelectedCategory(cat);
    setIsApplyOpen(true);
  };

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <ApplyIcon size={30} style={{ color: 'var(--primary)' }} />
            Apply for Candidacy / Open Categories
          </h1>
          <p>Submit your candidacy nomination form for any open election category.</p>
        </div>
      </div>

      <div className="filter-toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search open categories..."
          style={{ width: '320px' }}
        />
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={ApplyIcon}
          title="No Open Categories"
          description={searchTerm
            ? 'No open categories match your search terms.'
            : 'No election categories are open for nomination yet. Check back once an admin publishes one.'}
        />
      ) : (
        <div className="cards-grid">
          {filteredCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              role="candidate"
              onApply={handleOpenApply}
            />
          ))}
        </div>
      )}

      <ApplyModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
};

export default CandidateApply;

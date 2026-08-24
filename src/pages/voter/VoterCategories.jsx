import React, { useState } from 'react';
import { CategoryCard } from '../../components/common/Cards';
import { VotingModal, ConfirmVoteModal, VoteSuccessModal } from '../../components/voting/VotingModals';
import { SearchBar } from '../../components/common/FormFields';
import { EmptyState } from '../../components/common/UI';
import { useVoting } from '../../context/AppContext';
import { CategoryIcon } from '../../assets/icons';

export const VoterCategories = () => {
  const { categories, hasVotedCategory, castVote } = useVoting();
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [receiptResult, setReceiptResult] = useState(null);

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartVote = (category) => {
    setSelectedCategory(category);
    setIsVoteModalOpen(true);
  };

  const handleSelectCandidateToVote = (candidate) => {
    setSelectedCandidate(candidate);
    setIsVoteModalOpen(false);
    setIsConfirmOpen(true);
  };

  const handleConfirmVote = () => {
    if (selectedCategory && selectedCandidate) {
      const result = castVote(selectedCategory.name, selectedCandidate);
      setReceiptResult({
        ...result,
        category: selectedCategory.name,
        candidate: selectedCandidate.name
      });
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
    }
  };

  return (
    <div>
      <div className="page-header-banner">
        <div className="page-title-group">
          <h1>
            <CategoryIcon size={30} style={{ color: 'var(--primary)' }} />
            Active Elections & Ballots
          </h1>
          <p>Review contested posts, evaluate candidate manifestos, and cast your vote.</p>
        </div>
      </div>

      <div className="filter-toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search contested categories..."
          style={{ width: '320px' }}
        />
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState
          title="No Categories Available"
          description="No active elections matching your search terms."
        />
      ) : (
        <div className="cards-grid">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              role="voter"
              hasVoted={hasVotedCategory(category.name)}
              onVote={handleStartVote}
            />
          ))}
        </div>
      )}

      <VotingModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        category={selectedCategory}
        onSelectCandidate={handleSelectCandidateToVote}
      />

      <ConfirmVoteModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setIsVoteModalOpen(true);
        }}
        onConfirm={handleConfirmVote}
        candidate={selectedCandidate}
        categoryName={selectedCategory?.name}
      />

      <VoteSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        receiptData={receiptResult}
      />
    </div>
  );
};

export default VoterCategories;

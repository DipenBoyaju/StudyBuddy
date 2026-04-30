import { useNavigate } from 'react-router-dom';

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/document/${flashcardSet.document._id}/flashcards`);
  };

  const reviewCount = flashcardSet.cards.filter(Card => card.lastReviewed).length;

  return (
    <div>FlashcardSetCard</div>
  )
}
export default FlashcardSetCard
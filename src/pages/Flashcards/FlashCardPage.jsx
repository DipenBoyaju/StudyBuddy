import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import flashcardService from "../../services/flashcardService";
import toast from "react-hot-toast";
import aiService from "../../services/aiService";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Flashcard from "../../components/flashcards/Flashcard";
import Button from "../../components/common/Button";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";

const FlashCardPage = () => {
  const { id: documentId } = useParams();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardForDocument(documentId);
      setFlashcardSets(response.data[0]);
      setFlashcards(response.data[0]?.cards || []);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcard generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcard.")
    } finally {
      generating(false);
    }
  }

  const handleNextCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  }

  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  }

  const handleReview = async (index) => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success("Flash reviewed!");
    } catch (error) {
      toast.error("failed to review flashcard.")
    }
  }

  const handleToogleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prevFlashcards) => prevFlashcards.map((card) => card._id === cardId ? { ...card, isStarred: !card.isStarred } : card))
      toast.success("Flashcard starred status updated!")
    } catch (error) {
      toast.error("Failed to update star status.")
    }
  }

  const handleDeleteFlashcardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSets._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.")
    } finally {
      setDeleting(false);
    }
  }

  const renderFlashcardContent = () => {
    if (loading) {
      return <Spinner />
    }

    if (flashcards.length === 0) {
      return (
        <EmptyState title="No Flashcards Yet" description="Generate flashcards for your document to start learning." />
      )
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-md">
          <Flashcard flashcard={currentCard} onToggleStar={handleToogleStar} />
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handlePrevCard} variant="secondary" disabled={flashcards.length <= 1}>
            <ChevronLeft size={16} /> Previous
          </Button>
          <span className="text-sm text-neutral-600">{currentCardIndex + 1} / {flashcards.length}</span>
          <Button onClick={handleNextCard} variant="secondary" disabled={flashcards.length <= 1}>
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <Link to={`/documents/${documentId}`} className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
          <ArrowLeft size={16} />
          Back to Document
        </Link>
      </div>
      <div className="flex justify-between items-center">
        <PageHeader title="Flashcards" />
        <div className="flex gap-2">
          {
            !loading && (
              flashcards.length > 0 ? (
                <>
                  <Button onClick={() => setIsDeleteModalOpen(true)} disabled={deleting}>
                    <Trash2 size={16} />
                    Delete Set
                  </Button>
                </>
              ) : (
                <Button onClick={handleGenerateFlashcards} disabled={generating}>
                  {generating ? (
                    <Spinner />
                  ) : (
                    <>
                      <Plus size={16} /> Generating Flashcards
                    </>
                  )}
                </Button>
              )
            )
          }
        </div>
      </div>
      {renderFlashcardContent()}

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete Flashcard Set">
        <div className="space-y-6">
          <p className="text-sm text-slate-600">Are you sure you want to delete all flashcards for this document? This action cannot be undone.</p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" variant="secondary" onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting} className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button onClick={handleDeleteFlashcardSet} disabled={deleting} className="px-5 h-11 bg-linear-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">
              {
                deleting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting...
                  </span>
                ) : (
                  "Delete"
                )
              }
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default FlashCardPage
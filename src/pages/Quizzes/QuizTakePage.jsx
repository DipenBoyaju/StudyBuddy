import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import quizService from "../../services/quizService";
import toast from "react-hot-toast";

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        toast.error('Failed to fetch quiz');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionchange = (questionId, optionIndex) => {
    setSelectedAnswer((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }


  return (
    <div>QuizTakePage</div>
  )
}
export default QuizTakePage
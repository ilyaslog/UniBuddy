import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: string;
}

interface QuizProps {
  sessionId: string;
  username: string;
}

interface QuizResponse {
  questions: Question[];
}

export default function Quiz({ sessionId, username }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setQuizCompleted(false);
    setScore(0);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, username }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }
      
      const data: QuizResponse = await response.json();
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setQuizCompleted(false);
      setScore(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerCorrect !== null) return; // Prevent changing answer after submission
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerCorrect !== null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correct;
    setIsAnswerCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    }

    // Wait 1.5 seconds before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={generateQuiz}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-center mb-4">Quiz Completed!</h3>
        <div className="text-center mb-6">
          <p className="text-lg">Your Score: {score}/{questions.length}</p>
          <p className="text-gray-600">
            ({Math.round((score / questions.length) * 100)}%)
          </p>
        </div>
        <button
          onClick={generateQuiz}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Take Another Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <button
        onClick={generateQuiz}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate Quiz
      </button>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <span className="text-sm text-gray-600">
          Score: {score}/{currentQuestionIndex}
        </span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-semibold mb-4">{currentQuestion.question}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // Convert 0 to 'A', 1 to 'B', etc.
            const isSelected = selectedAnswer === letter;
            const showCorrect = isAnswerCorrect !== null && letter === currentQuestion.correct;
            const showIncorrect = isAnswerCorrect !== null && isSelected && !showCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(letter)}
                className={`w-full p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                } ${showCorrect ? 'bg-green-50 border-green-500' : ''} 
                ${showIncorrect ? 'bg-red-50 border-red-500' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrect && <Check className="text-green-500" />}
                  {showIncorrect && <X className="text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmitAnswer}
          disabled={!selectedAnswer || isAnswerCorrect !== null}
          className={`w-full mt-6 p-3 rounded-lg transition-colors ${
            !selectedAnswer || isAnswerCorrect !== null
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}
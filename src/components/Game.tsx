import { useState, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import Confetti from "react-confetti";

const Game = () => {
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [result, setResult] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionCount, setQuestionCount] = useState(0); // Count questions
  const [showResults, setShowResults] = useState(false); // Show after 7 questions
  const [timeLeft, setTimeLeft] = useState(10); // 10 second timer
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Track correct answer feedback
  const [gameWon, setGameWon] = useState(false); // Track if the player won

  const t = trpc.main;
  const { data: choices, refetch } = t.getChoices.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (timeLeft > 0 && questionCount < 7) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questionCount < 7) {
      setResult("Wrong! 😢");
      handleNextQuestion(false); // If time runs out, treat it as a wrong answer
    }
  }, [timeLeft, questionCount]);

  const checkAnswer = t.checkAnswer.useMutation({
    onSuccess: (isReal) => {
      setIsCorrect(isReal);
      setResult(isReal ? "Correct! 🎉" : "Wrong! 😢");
      if (isReal) {
        setScore(score + 1);
        setPoints(points + 10); // Earn 10 points for a correct answer
      }

      setTimeout(() => {
        handleNextQuestion(isReal);
      }, 1500); // Delay before showing the next question
    },
  });

  const handleNextQuestion = (isReal: boolean) => {
    setSelectedChoice(null);
    refetch();
    setQuestionCount(questionCount + 1);
    setIsCorrect(null);
    setTimeLeft(10); // Reset timer for next round

    if (questionCount === 6) {
      setShowResults(true);
      checkWinCondition();
    }
  };

  const checkWinCondition = () => {
    const winCondition = score >= 4; // Example winning condition: 4 correct answers out of 7
    setGameWon(winCondition);
    if (winCondition) {
      setShowConfetti(true); // Show confetti if player wins
    }
  };

  const handleGuess = (chosenWord: string) => {
    setSelectedChoice(chosenWord);
  };

  const handleSubmitAnswer = () => {
    if (selectedChoice) {
      checkAnswer.mutate({ word: selectedChoice });
    } else {
      setResult("Please select an option first.");
    }
  };

  const getLevel = (score: number) => {
    if (score < 5) return "Beginner";
    if (score < 10) return "Intermediate";
    if (score < 20) return "Advanced";
    return "Expert";
  };

  const getBadge = (score: number) => {
    if (score >= 20) return "🏆 Master";
    if (score >= 10) return "🥈 Pro";
    if (score >= 5) return "🥉 Novice";
    return "Noob";
  };

  const handleResetGame = () => {
    setScore(0);
    setPoints(0);
    setQuestionCount(0);
    setShowResults(false);
    setShowConfetti(false); // Hide confetti on reset
    setGameWon(false); // Reset win state
    setTimeLeft(10);
    setResult("");
    refetch(); // Get new set of words
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-100">
      {showConfetti && <Confetti />} {/* Confetti shows only on win */}
      {choices && !showResults ? (
        <div className="relative max-w-3xl w-11/12 bg-white bg-opacity-40 rounded-xl shadow-xl backdrop-blur-lg backdrop-brightness-90 px-10 py-16">
          <h1 className="sm:text-3xl text-2xl text-center font-bold mb-16 text-gray-900">
            Which of these is a real German word?
          </h1>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {choices.map((choice) => (
              <button
                key={choice.word}
                className={`md:text-xl py-5 px-8 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 ${
                  selectedChoice === choice.word
                    ? isCorrect === null
                      ? "bg-blue-700"
                      : isCorrect
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-blue-500"
                }`}
                onClick={() => handleGuess(choice.word)}
                disabled={isCorrect !== null} // Disable after submitting
              >
                {choice.word}
              </button>
            ))}
          </div>

          <button
            className="w-full bg-blue-700 text-white py-4 px-6 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
            onClick={handleSubmitAnswer}
            disabled={isCorrect !== null} // Disable after submitting
          >
            Submit Answer
          </button>

          <p className="text-lg font-medium mt-8 text-center text-gray-800">
            Time Left: {timeLeft} seconds
          </p>
          <p className="text-lg font-medium mt-6 text-center text-gray-800">
            {result}
          </p>
        </div>
      ) : (
        showResults && (
          <div className="relative max-w-3xl w-11/12 bg-white bg-opacity-40 rounded-xl shadow-xl backdrop-blur-lg backdrop-brightness-90 px-10 py-16">
            <h1
              className={`sm:text-4xl text-3xl text-center font-bold mb-12 ${
                gameWon ? "text-green-500" : "text-red-500"
              }`}
            >
              {gameWon ? "You Won! 🎉" : "Game Over!"}
            </h1>
            <p className="text-2xl font-bold text-center text-gray-800">
              Score: {score}
            </p>
            <p className="text-xl font-medium text-center text-gray-800 mt-2">
              Level: {getLevel(score)}
            </p>
            <p className="text-xl font-medium text-center text-gray-800 mt-2">
              Badge: {getBadge(score)}
            </p>
            <p className="text-xl font-medium text-center text-gray-800 mt-2">
              Points: {points}
            </p>
            <button
              className="w-full mt-6 bg-blue-700 text-white py-4 px-6 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
              onClick={handleResetGame}
            >
              Play Again
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Game;

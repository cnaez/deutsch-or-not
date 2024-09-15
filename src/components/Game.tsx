import { useState, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import Confetti from "react-confetti";

const Game = () => {
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [result, setResult] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameWon, setGameWon] = useState(false);

  const t = trpc.main;
  const { data: choices, refetch } = t.getChoices.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (timeLeft > 0 && questionCount < 7) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questionCount < 7) {
      handleNextQuestion(false); // If time runs out, treat it as a wrong answer
    }
  }, [timeLeft, questionCount]);

  const checkAnswer = t.checkAnswer.useMutation({
    onSuccess: (isReal) => {
      setIsCorrect(isReal);
      setResult(isReal ? "Correct! 🎉" : "Wrong! 😢");
      if (isReal) {
        setScore(score + 1);
        setPoints(points + 10);
      }

      // Show feedback and then move to the next question
      setTimeout(() => {
        handleNextQuestion(isReal);
      }, 1500); // Short delay before showing the next question
    },
  });

  const handleNextQuestion = async (isReal: boolean) => {
    setSelectedChoice(null);
    await refetch(); // Ensure refetch happens, but you might want to handle loading states
    setQuestionCount((prev) => prev + 1);
    setIsCorrect(null);
    setTimeLeft(10);

    if (questionCount + 1 === 7) {
      setShowResults(true);
      checkWinCondition();
    }
  };

  const checkWinCondition = () => {
    const winCondition = score >= 4;
    setGameWon(winCondition);
    if (winCondition) {
      setShowConfetti(true);
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
    setShowConfetti(false);
    setGameWon(false);
    setTimeLeft(10);
    setResult("");
    refetch(); // Get new set of words
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-100">
      {showConfetti && <Confetti />}
      {choices && !showResults ? (
        <div className="relative max-w-3xl w-11/12 bg-white bg-opacity-40 rounded-xl shadow-xl backdrop-blur-lg backdrop-brightness-90 px-10 py-16">
          <h1 className="sm:text-3xl text-2xl text-center font-bold mb-16 text-gray-900">
            {isCorrect === null
              ? "Which of these is a real German word?"
              : result}
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
                disabled={isCorrect !== null}
              >
                {choice.word}
              </button>
            ))}
          </div>

          <button
            className="w-full bg-blue-700 text-white py-4 px-6 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
            onClick={handleSubmitAnswer}
            disabled={isCorrect !== null}
          >
            Submit Answer
          </button>

          <p className="text-lg font-medium mt-8 text-center text-gray-800">
            Time Left: {timeLeft} seconds
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

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "../../utils/trpc";
import Confetti from "react-confetti";
import { useRouter } from "next/router";
import LoadingAnimation from "@/components/LoadingAnimation";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Button from "@/components/Button";
import ProgressBar from "@/components/ProgressBar";

const Game = () => {
  const { t } = useTranslation();
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  const router = useRouter();
  const { userId, userName } = router.query;

  const {
    data: choices,
    isLoading,
    refetch,
  } = trpc.main.getChoices.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const updateScore = trpc.main.updateUserScore.useMutation();

  useEffect(() => {
    if (timeLeft > 0 && questionCount < 7) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questionCount < 7) {
      const correct = choices?.find((choice) => choice.isReal);
      if (correct) setCorrectAnswer(correct.word);
      setIsCorrect(false); // Treat timeout as a wrong answer
      handleNextQuestion(null); // Show correct answer and move to next question
    }
  }, [timeLeft, questionCount]);

  const checkAnswer = trpc.main.checkAnswer.useMutation({
    onSuccess: (isReal) => {
      setIsCorrect(isReal);
      if (isReal) setScore(score + 1);
      const correct = choices?.find((choice) => choice.isReal);
      if (correct) setCorrectAnswer(correct.word);
      setTimeout(() => handleNextQuestion(isReal), 1200);
    },
  });

  const handleNextQuestion = async (isReal: boolean | null) => {
    setSelectedChoice(null);

    if (correctAnswer === null) {
      const correct = choices?.find((choice) => choice.isReal);
      if (correct) setCorrectAnswer(correct.word);
    }

    // Wait for 1.2 seconds to show the correct answer before moving to the next question
    setTimeout(async () => {
      await refetch();
      setQuestionCount((prev) => prev + 1);
      setIsCorrect(null);
      setCorrectAnswer(null);
      setTimeLeft(10);

      if (questionCount + 1 === 7) {
        checkWinCondition();
      }
    }, 1200);
  };

  const checkWinCondition = () => {
    const winCondition = score >= 3;
    setShowConfetti(winCondition);
    updateScore.mutate({ userId: Number(userId), score });
    // Redirect to result route with score and gameWon status
    router.replace({
      pathname: "/result",
      query: { score, gameWon: winCondition, userName },
    });
  };

  const handleGuess = (chosenWord: string) => setSelectedChoice(chosenWord);

  const handleSubmitAnswer = () => {
    if (selectedChoice) {
      checkAnswer.mutate({ word: selectedChoice });
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div>
          <BackButton />
          <ProgressBar current={questionCount + 1} total={7} />
          <div>
            {showConfetti && <Confetti />}
            {choices && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    {questionCount + 1}/7
                  </h2>
                </div>
                <h1 className="sm:text-3xl text-2xl text-center font-bold mb-16 text-gray-900">
                  {isCorrect === null
                    ? t("game.question")
                    : isCorrect
                    ? t("game.correct")
                    : t("game.wrong")}
                </h1>
                <Box>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {choices.map((choice) => (
                      <button
                        key={choice.word}
                        className={`md:text-xl py-5 px-8 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 disabled:cursor-not-allowed ${
                          selectedChoice === choice.word
                            ? isCorrect === null
                              ? "bg-blue-700"
                              : isCorrect
                              ? "bg-green-500"
                              : choice.word === correctAnswer
                              ? "bg-green-500"
                              : "bg-red-500"
                            : choice.word === correctAnswer
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                        onClick={() => handleGuess(choice.word)}
                        disabled={isCorrect !== null}
                      >
                        {choice.word}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={isCorrect !== null}
                  >
                    {t("game.submitAnswer")}
                  </Button>
                  <p className="text-lg font-medium mt-8 text-center text-gray-800">
                    {t("game.timeLeft")}:{" "}
                    <span
                      className={`animate__animated animate__infinite  ${
                        timeLeft <= 3
                          ? "text-red-600 text-2xl animate__flash"
                          : "animate__pulse text-xl"
                      }`}
                    >
                      {timeLeft}
                    </span>{" "}
                    seconds
                  </p>
                </Box>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Game;

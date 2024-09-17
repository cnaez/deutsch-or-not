import { useRouter } from "next/router";
import Confetti from "react-confetti";
import Leaderboard from "../components/Leaderboard";
import Box from "../components/Box";
import Button from "../components/Button";
import { useTranslation } from "react-i18next";

const Result = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { score, gameWon, userName } = router.query;

  const handlePlayAgain = () => {
    router.replace("/game");
  };

  const getLevel = (score: number) => {
    if (score < 5) return t("game.levelBeginner");
    if (score < 10) return t("game.levelIntermediate");
    if (score < 20) return t("game.levelAdvanced");
    return t("game.levelExpert");
  };

  const getBadge = (score: number) => {
    if (score >= 20) return t("game.badgeMaster");
    if (score >= 10) return t("game.badgePro");
    if (score >= 5) return t("game.badgeNovice");
    return t("game.badgeNoob");
  };

  return (
    <Box>
      {gameWon && <Confetti />}
      <div className="mb-10">
        <div className="mb-6">
          <h1
            className={`sm:text-6xl text-5xl text-center font-bold glow-text animate__animated ${
              gameWon === "true"
                ? "text-green-500 animate__tada"
                : "text-red-500 animate__bounce"
            }`}
          >
            {gameWon === "true" ? t("game.youWon") : t("game.gameOver")}
            <div className="text-white sm:text-4xl text-3xl mt-2">
              {userName}
            </div>
          </h1>
        </div>
        <p className="sm:text-3xl text-2xl font-bold text-center text-gray-800">
          {t("game.score")}: {score}
        </p>
        <p className="sm:text-xl font-medium text-center text-gray-800 mt-4">
          {t("game.level")}: {getLevel(Number(score))}
        </p>
        <p className="sm:text-xl font-medium text-center text-gray-800 mt-2">
          {t("game.badge")}: {getBadge(Number(score))}
        </p>
      </div>
      <Leaderboard currentUser={userName} />
      <div className="grid md:grid-cols-2 gap-4 mb-2 mt-8">
        <Button className="w-full" onClick={() => router.replace("/")}>
          {t("game.goHome")}
        </Button>
        <Button className="w-full bg-transparent" onClick={handlePlayAgain}>
          {t("game.playAgain")}
        </Button>
      </div>
    </Box>
  );
};

export default Result;

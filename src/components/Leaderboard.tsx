import { trpc } from "../../utils/trpc";
import { useTranslation } from "react-i18next";
import { getBadge } from "../../utils/gameHelpers"; // Reuse your existing logic for level and badge

const Leaderboard = () => {
  const { t } = useTranslation();
  const { data: leaderboard, isLoading } = trpc.main.getLeaderboard.useQuery();

  if (isLoading) return <p>Loading leaderboard...</p>;

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-8">
        {t("leaderboard.title")}
      </h2>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-gray-700">
          {t("leaderboard.rank")}
        </span>
        <span className="text-sm font-bold text-gray-700">
          {t("leaderboard.player")}
        </span>
        <span className="text-sm font-bold text-gray-700">
          {t("leaderboard.badge")}
        </span>
        <span className="text-sm font-bold text-gray-700">
          {t("leaderboard.score")}
        </span>
      </div>
      {leaderboard?.map((user, index) => (
        <div
          key={user.id}
          className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 mb-4 transition-transform transform hover:scale-105"
        >
          <span className="text-lg font-bold text-gray-800">{index + 1}</span>
          <span className="text-lg font-medium text-gray-700">{user.name}</span>

          <span className="text-sm">
            <span
              className={`px-3 py-1 rounded-full text-white font-bold ${
                getBadge(user.score, t) === "Master"
                  ? "bg-purple-500"
                  : getBadge(user.score, t) === "Pro"
                  ? "bg-green-500"
                  : getBadge(user.score, t) === "Novice"
                  ? "bg-blue-500"
                  : "bg-gray-500"
              }`}
            >
              {getBadge(user.score, t)}
            </span>
          </span>
          <span className="text-lg font-bold text-gray-800">{user.score}</span>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;

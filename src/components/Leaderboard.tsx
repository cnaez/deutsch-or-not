import { trpc } from "../../utils/trpc";
import { useTranslation } from "react-i18next";
import { getBadge } from "../../utils/gameHelpers";

const Leaderboard = () => {
  const { t } = useTranslation();
  const { data: leaderboard, isLoading } = trpc.main.getLeaderboard.useQuery();

  const rankHandler = (i: number) => {
    switch (i) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";

      default:
        return i;
    }
  };

  if (isLoading) return <p>Loading leaderboard...</p>;
  if (leaderboard?.length === 0) return;

  return (
    <div className="md:px-6 py-6 rounded-xlm shadow-lg max-w-3xl mx-auto bg-[#eee] bg-opacity-30">
      <h2 className="text-2xl font-extrabold text-center text-purple-500 mb-8">
        {t("leaderboard.title")}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-white bg-opacity-20 text-white">
              <th className="py-2 px-4 border-b border-white">
                {t("leaderboard.rank")}
              </th>
              <th className="py-2 px-4 border-b border-white">
                {t("leaderboard.player")}
              </th>
              <th className="py-2 px-4 border-b border-white">
                {t("leaderboard.badge")}
              </th>
              <th className="py-2 px-4 border-b border-white">
                {t("leaderboard.score")}
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard?.map((user, index) => (
              <tr
                key={user.id}
                className={`bg-white bg-opacity-20 hover:bg-opacity-30 transition-opacity ${
                  index % 2 === 0 ? "bg-opacity-10" : "bg-opacity-15"
                }`}
              >
                <td className="py-2 px-4 border-b border-white text-white">
                  {rankHandler(index + 1)}
                </td>
                <td className="py-2 px-4 border-b border-white text-stone-600">
                  {user.name}
                </td>
                <td className="py-2 px-4 border-b border-white text-stone-700">
                  <span
                    className={`px-3 py-1 rounded-full text-stone-700 text-sm font-semibold text-nowrap ${
                      getBadge(user.score, t) === "Master"
                        ? "bg-yellow-500"
                        : getBadge(user.score, t) === "Pro"
                        ? "bg-zinc-400"
                        : getBadge(user.score, t) === "Novice"
                        ? "bg-orange-900"
                        : "bg-violet-100"
                    }`}
                  >
                    {getBadge(user.score, t)}
                  </span>
                </td>
                <td className="py-2 px-4 border-b border-white text-stone-600 font-bold">
                  {user.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;

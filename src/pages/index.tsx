import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { trpc } from "../../utils/trpc";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Spinner from "@/components/Spinner";
import Box from "@/components/Box";

const WelcomePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(""); // State to store user name
  const [error, setError] = useState("");

  const createUser = trpc.main.createUser.useMutation({
    onSuccess: (user) => {
      // Pass user info to the game route
      router.push({
        pathname: "/game",
        query: { userId: user.id, userName: user.name },
      });
    },
    onError: (err) => {
      setError(err.message);
      setLoading(false);
    },
  });

  const handleStart = () => {
    if (!name) {
      setError(t("welcome.enterName"));
      return;
    }

    setLoading(true);
    createUser.mutate({ name });
  };

  return (
    <div>
      <LanguageSwitcher />
      <Box>
        <h1 className="text-5xl font-extrabold mb-6 animate__animated animate__fadeIn animate__delay-1s">
          {t("welcome.title")}
        </h1>
        <p className="text-lg mb-8 animate__animated animate__fadeIn animate__delay-2s">
          {t("welcome.description")}
        </p>

        <div className="mb-5">
          <input
            type="text"
            placeholder={t("welcome.enterYourName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5"
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <button
          onClick={handleStart}
          className={`bg-gradient-to-r from-green-400 to-blue-500 text-white py-4 px-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 flex justify-center mx-auto w-4/5 ${
            loading ? "opacity-80 cursor-not-allowed" : "glow-text"
          } ${name ? "opacity-100" : "opacity-0"}`}
          disabled={loading}
        >
          {loading ? <Spinner /> : t("welcome.startGame")}
        </button>

        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <svg
            className="absolute -top-1/2 -left-1/2 w-1/2 h-auto"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#ffffff"
              fillOpacity="0.3"
              d="M0,256L1440,320L1440,0L0,0Z"
            ></path>
          </svg>
          <svg
            className="absolute bottom-0 right-0 w-1/2 h-auto"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#ffffff"
              fillOpacity="0.3"
              d="M0,64L1440,128L1440,320L0,320Z"
            ></path>
          </svg>
        </div>
      </Box>
    </div>
  );
};

export default WelcomePage;

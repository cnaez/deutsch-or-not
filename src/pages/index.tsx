import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Spinner from "@/components/Spinner";

const WelcomePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/game");
    }, 500); // Simulate loading time
  };

  return (
    <div>
      <LanguageSwitcher />
      <div className="relative bg-white bg-opacity-10 p-8 rounded-xl shadow-2xl backdrop-blur-md max-w-md mx-auto text-center mt-6">
        <h1 className="text-5xl font-extrabold mb-4 animate__animated animate__fadeIn animate__delay-1s">
          {t("welcome.title")}
        </h1>
        <p className="text-lg mb-6 animate__animated animate__fadeIn animate__delay-2s">
          {t("welcome.description")}
        </p>
        <button
          onClick={handleStart}
          className={`bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
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
      </div>
    </div>
  );
};

export default WelcomePage;

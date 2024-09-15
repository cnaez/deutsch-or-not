import "animate.css";
import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import "../../i18n";
import type { AppType } from "next/app";
import { trpc } from "../../utils/trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen glow-effect text-white">
      <Component {...pageProps} />
    </div>
  );
};

export default trpc.withTRPC(appWithTranslation(MyApp));

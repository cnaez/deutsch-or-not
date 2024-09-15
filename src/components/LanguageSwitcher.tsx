// components/LanguageSwitcher.tsx
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Image from "next/image";
import de from "../../public/flags/de.png";
import en from "../../public/flags/en.png";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(
    router.locale || "en"
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    setSelectedLanguage(newLang);
    i18n.changeLanguage(newLang);
    router.push(router.pathname, router.asPath, { locale: newLang });
  };

  return (
    <div className="absolute top-4 right-4">
      <select
        value={selectedLanguage}
        onChange={handleChange}
        className="bg-white text-gray-800 rounded-lg p-2 shadow-md"
      >
        <option value="en" className="flex items-center">
          <Image src={en} fill alt="English" className="w-6 h-4 mr-2" /> English
        </option>
        <option value="de" className="flex items-center">
          <Image src={de} fill alt="Deutsch" className="w-6 h-4 mr-2" /> Deutsch
        </option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;

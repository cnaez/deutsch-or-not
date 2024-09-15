// components/LanguageSwitcher.tsx
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Image from "next/image";
import de from "../../public/flags/de.png";
import en from "../../public/flags/en.png";

const options = [
  { id: "1", name: "English", value: "en", src: en },
  { id: "2", name: "Deutsch", value: "de", src: de },
  { id: "3", name: "Español", value: "es", src: de },
  { id: "4", name: "Türkçe", value: "tr", src: de },
  { id: "5", name: "العربية", value: "ar", src: de },
  { id: "6", name: "فارسی", value: "fa", src: de },
];

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
        {options.map((i) => (
          <option key={i.id} value={i.value} className="flex items-center">
            {/* <Image src={i.src} fill alt={i.name} className="w-6 h-4 mr-2" />{" "} */}
            {i.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;

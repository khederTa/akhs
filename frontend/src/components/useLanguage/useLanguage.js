import { useEffect } from "react";
import i18n from "../../i18n"; // Adjust the import path as necessary
import { useLocalStorage } from "../useStorage/useStorage"; // Adjust the import path as necessary

export function useLanguage(defaultLanguage = "en") {
  const [language, setLanguage] = useLocalStorage("language", defaultLanguage);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.setAttribute(
      "dir",
      language === "ar" ? "rtl" : "ltr"
    );
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "en" ? "ar" : "en"));
  };

  return [language, toggleLanguage];
}

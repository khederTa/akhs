import { useEffect } from "react";
import i18n from "../../i18n"; // Adjust the import path as necessary
import { useLocalStorage } from "../useStorage/useStorage"; // Adjust the import path as necessary

export function useLanguage(defaultLanguage = "en") {
  const [language, setLanguage] = useLocalStorage("language", defaultLanguage);

  useEffect(() => {
    i18n.changeLanguage(language);
    const dir = language === "en" ? "ltr" : "rtl";
    const newDir = language === "en" ? "rtl" : "ltr";
    const elements = document.querySelectorAll(`[dir=${dir}]`);
    elements.forEach((element) => {
      element.setAttribute("dir", newDir);
    });
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prevLanguage: string) =>
      prevLanguage === "en" ? "ar" : "en"
    );
  };

  return [language, toggleLanguage];
}

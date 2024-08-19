import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Avatar from "@mui/material/Avatar";
import { useContext } from "react";
import { DarkModeContext, LanguageContext } from "../../App";
export function Navbar() {
  const darkModeContext = useContext(DarkModeContext);
  if (!darkModeContext) {
    throw new Error("Navbar must be used within a DarkModeContextProvider");
  }
  const { darkMode, toggleDarkMode } = darkModeContext;
  
  const languageContext = useContext(LanguageContext);
  if (!languageContext) {
    throw new Error("Navbar must be used within a LanguageContextProvider");
  }
  const { language, switchLanguage } = languageContext;
  return (
    <nav className="flex items-center justify-end p-3 bg-[var(--sidebar-background-color)] dark:bg-[var(--sidebar-background-dark-color)]">
      {/* <h1 className="text-md font-semibold">{t("dashboard")}</h1> */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => toggleDarkMode()}
          className="p-2 text-[var(--primary-color)] rounded-full hover:text-[var(--text-color)] dark:hover:text-[#fff]"
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
        <button
          onClick={switchLanguage}
          className="p-2 text-[var(--primary-color)] rounded-full hover:text-[var(--text-color)] dark:hover:text-[#fff]"
        >
          {language === "en" ? "AR" : "EN"}
        </button>
        <Avatar alt="User Avatar" src="/path/to/avatar/image.jpg" />
      </div>
    </nav>
  );
}

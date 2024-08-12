import React, { useEffect, useState } from "react";
import useDarkMode from "./components/useDarkMode/useDarkMode";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Avatar from "@mui/material/Avatar";
import "./index.css";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./components/useLanguage/useLanguage"; // Adjust the import path

function App() {
  const { collapseSidebar } = useProSidebar();
  const [darkMode, setDarkMode] = useDarkMode();
  const { t } = useTranslation();
  const [language, toggleLanguage] = useLanguage();
  const [rtl, setRtl] = useState(language === "ar");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    setRtl(language === "ar");
  }, [language]);

  return (
    <>
      <div id="app" className="h-screen flex flex-row">
        <Sidebar
          rtl={rtl}
          className="h-screen text-[var(--text-color)] dark:text-[var(--text-dark-color)]"
          backgroundColor={
            darkMode
              ? "var(--sidebar-background-dark-color)"
              : "var(--sidebar-background-color)"
          }
        >
          <Menu>
            <MenuItem
              className="text-center dark:hover:text-[var(--text-color)]"
              icon={<MenuOutlinedIcon />}
              onClick={() => {
                collapseSidebar();
              }}
            >
              <h2>{t("dashboard")}</h2>
            </MenuItem>

            <MenuItem
              className="dark:hover:text-[var(--text-color)]"
              icon={<HomeOutlinedIcon />}
            >
              {t("Home")}
            </MenuItem>
            <MenuItem
              className="dark:hover:text-[var(--text-color)]"
              icon={<PeopleOutlinedIcon />}
            >
              {t("Team")}
            </MenuItem>
            <MenuItem
              className="dark:hover:text-[var(--text-color)]"
              icon={<ContactsOutlinedIcon />}
            >
              {t("Contacts")}
            </MenuItem>
            <MenuItem
              className="dark:hover:text-[var(--text-color)]"
              icon={<ReceiptOutlinedIcon />}
            >
              {t("Profile")}
            </MenuItem>
            <MenuItem
              className="dark:hover:text-[var(--text-color)]"
              icon={<HelpOutlineOutlinedIcon />}
            >
              {t("FAQ")}
            </MenuItem>
            <MenuItem
              className="dark:hover:text-[var(--text-color)]"
              icon={<CalendarTodayOutlinedIcon />}
            >
              {t("Calendar")}
            </MenuItem>
          </Menu>
        </Sidebar>

        <main className="w-full text-[var(--text-color)] dark:text-[var(--text-dark-color)] bg-[var(--main-background-color)] dark:bg-[var(--main-background-dark-color)]">
          {/* Navbar */}
          <nav className="flex items-center justify-between p-3 bg-[var(--sidebar-background-color)] dark:bg-[var(--sidebar-background-dark-color)]">
            <h1 className="text-md font-semibold">{t("dashboard")}</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode((prevDarkMode) => !prevDarkMode)}
                className="p-2 text-[var(--primary-color)] rounded-full hover:text-[var(--text-color)] dark:hover:text-[#fff]"
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </button>
              <button
                onClick={toggleLanguage}
                className="p-2 text-[var(--primary-color)] rounded-full hover:text-[var(--text-color)] dark:hover:text-[#fff]"
              >
                {language === "en" ? "AR" : "EN"}
              </button>
              <Avatar alt="User Avatar" src="/path/to/avatar/image.jpg" />
            </div>
          </nav>

          {/* Main Content */}
          <div className="p-4">
            <h2>{t("welcome to the dashboard")}</h2>
            {/* Add more content here */}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;

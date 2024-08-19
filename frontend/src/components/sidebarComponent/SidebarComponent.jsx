import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext, LanguageContext } from "../../App";

export function SidebarComponent() {
  const { collapseSidebar } = useProSidebar();
  const darkModeContext = useContext(DarkModeContext);
  if (!darkModeContext) {
    throw new Error("Sidebar must be used within a DarkModeContextProvider");
  }
  const { darkMode, toggleDarkMode } = darkModeContext;
  
  const languageContext = useContext(LanguageContext);
  if (!languageContext) {
    throw new Error("Sidebar must be used within a LanguageContextProvider");
  }
  const { language } = languageContext;
  const [rtl, setRtl] = useState(language === "ar");
  
  const { t } = useTranslation();

  useEffect(() => {
    setRtl(language === "ar");
  }, [language]);
  return (
    <>
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
            <Link to="/">{t("Home")}</Link>
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
    </>
  );
}

import Stack from "@mui/material/Stack";
// import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
// import MenuButton from "./MenuButton";
import LanguageIcon from "@mui/icons-material/Language";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import i18n from "../i18n"; // Adjust the import path as necessary
import { IconButton } from "@mui/material";
import { useState, useContext } from "react";
import { DIRECTION_ACTIONS, DirectionContext } from "../shared-theme/AppTheme"; // Import DirectionContext
import { useAuthStore } from "../store/auth";

export default function Header() {
  const [language, setLanguage] = useState(i18n.language || "en"); // Initialize based on the current language
  const { direction, dispatchDirection } = useContext(DirectionContext); // Use DirectionContext to toggle direction
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const loggedIn = isLoggedIn();
  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
    dispatchDirection({
      type: DIRECTION_ACTIONS.TOGGLE_DIRECTION,
      payload: newLanguage,
    }); // Dispatch action to update direction
    const dir = language === "en" ? "ltr" : "rtl";
    const newDir = language === "en" ? "rtl" : "ltr";
    localStorage.setItem("dir", newDir)
    const elements = document.querySelectorAll(`[dir=${dir}]`);
    elements.forEach((element) => {
      element.setAttribute("dir", newDir);
    });
  };

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: `${loggedIn ? "space-between" : "flex-end"}`,
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
      dir={direction}
    >
      {loggedIn && <NavbarBreadcrumbs />}
      <Stack direction="row" sx={{ gap: 1 }}>
        {/* <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton> */}
        <ColorModeIconDropdown />
        <IconButton
          data-screenshot="toggle-mode"
          onClick={toggleLanguage}
          disableRipple
          size="small"
        >
          <LanguageIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}

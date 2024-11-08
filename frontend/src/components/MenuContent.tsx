import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
// import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
// import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import DomainIcon from "@mui/icons-material/Domain";
import ModeIcon from "@mui/icons-material/Mode";
import { useTranslation } from "react-i18next";
const mainListItems = [
  { text: "home", icon: <HomeRoundedIcon />, to: "/" },
  {
    text: "activity management",
    icon: <EventRoundedIcon />,
    to: "/activity-management",
  },
  {
    text: "volunteer management",
    icon: <AccountBoxRoundedIcon />,
    to: "/volunteer",
  },
  {
    text: "provider management",
    icon: <SupervisorAccountIcon />,
    to: "/serviceprovider",
  },
  {
    text: "user management",
    icon: <ManageAccountsIcon />,
    to: "/user-management",
  },
  {
    text: "activity type management",
    icon: <EditCalendarRoundedIcon />,
    to: "/activity-types",
  },
  { text: "package management", icon: <ListAltRoundedIcon />, to: "/packages" },
  { text: "department management", icon: <DomainIcon />, to: "/departments" },
  { text: "position management", icon: <ModeIcon />, to: "/position" },
];

// const secondaryListItems = [
//   { text: "Settings", icon: <SettingsRoundedIcon /> },
//   { text: "About", icon: <InfoRoundedIcon /> },
//   { text: "Feedback", icon: <HelpRoundedIcon /> },
// ];

export default function MenuContent() {
  const location = useLocation();
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(
    mainListItems.findIndex((item) => item.to === location.pathname)
  );
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ display: "block" }}
          >
            <ListItemButton
              selected={index === selectedItemIndex}
              onClick={() => {
                setSelectedItemIndex(index);
                navigate(item.to);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.text)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* 
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}

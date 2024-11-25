/* eslint-disable react-hooks/rules-of-hooks */
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
import { usePermissionStore } from "../store/permissionStore";

const mainListItems = [
  { text: "home", icon: <HomeRoundedIcon />, to: "/", access: "read_home" },
  {
    text: "activity management",
    icon: <EventRoundedIcon />,
    to: "/activity-management",
    access: "read_activity",
  },
  {
    text: "volunteer management",
    icon: <AccountBoxRoundedIcon />,
    to: "/volunteer",
    access: "read_volunteer",
  },
  {
    text: "provider management",
    icon: <SupervisorAccountIcon />,
    to: "/serviceprovider",
    access: "read_serviceProvider",
  },
  {
    text: "user management",
    icon: <ManageAccountsIcon />,
    to: "/user-management",
    access: "read_user",
  },
  {
    text: "activity type management",
    icon: <EditCalendarRoundedIcon />,
    to: "/activity-modules",
    access: "read_activityType",
  },
  {
    text: "package management",
    icon: <ListAltRoundedIcon />,
    to: "/packages",
    access: "read_package",
  },
  {
    text: "department management",
    icon: <DomainIcon />,
    to: "/departments",
    access: "read_department",
  },
  {
    text: "position management",
    icon: <ModeIcon />,
    to: "/position",
    access: "read_position",
  },
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
  const { permissions } = usePermissionStore((state) => state);

  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => {
          // Get the permission for the current item outside the JSX
          const hasPermission = permissions[item.access];

          // Conditionally render the ListItem based on the permission
          return (
            hasPermission && (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
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
            )
          );
        })}
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

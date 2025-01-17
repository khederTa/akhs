import * as React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { DirectionContext } from "../shared-theme/AppTheme";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { URL_MAP } from "../utils/routeMap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }: any) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export default function NavbarBreadcrumbs() {
  const { direction } = React.useContext(DirectionContext); // Use DirectionContext to toggle direction
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
      dir={direction}
    >
      <Typography variant="body1">{t("dashboard")}</Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.primary", fontWeight: 600 }}
      >
        {t(URL_MAP[location.pathname as keyof typeof URL_MAP])}
      </Typography>
    </StyledBreadcrumbs>
  );
}

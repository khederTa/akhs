import { ReactNode, useContext } from "react";
import { DirectionContext } from "../shared-theme/AppTheme";
import { alpha } from "@mui/material/styles";
import { Box, Stack } from "@mui/material";
import AppNavbar from "../components/AppNavbar";
import SideMenu from "../components/SideMenu";
import Header from "../components/Header";
import { useAuthStore } from "../store/auth";
import { Navigate, useLocation } from "react-router-dom"; // Redirect to the sign-in page

export function Layout({ children }: { children: ReactNode }) {
  const { direction } = useContext(DirectionContext); // Use DirectionContext to toggle direction
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const loggedIn = isLoggedIn();
  const location = useLocation();
  console.log({ location });
  // Redirect to sign-in page if the user is not logged in
  if (!loggedIn && location.pathname !== "/join-us") {
    return <Navigate to="/sign-in" />;
  }

  return (
    <Box sx={{ display: "flex" }} dir={direction}>
      {loggedIn && (
        <>
          <SideMenu />
          <AppNavbar />
        </>
      )}
      {/* Main content */}
      <Box
        component="main"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sx={(theme: any) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: "auto",
        })}
        dir={direction}
      >
        <Stack
          spacing={2}
          sx={{
            // alignItems: "center",
            pb: 10,
            mx: 3,
            mt: { xs: 8, md: 0 },
          }}
          dir={direction}
        >
          <Header />
          {children}
        </Stack>
      </Box>
    </Box>
  );
}

import CssBaseline from "@mui/material/CssBaseline";
import AppTheme, { DirectionContext } from "./shared-theme/AppTheme";
import { useContext, useEffect } from "react";
import { setUser } from "./utils/auth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import { Stack } from "@mui/material";
import { useAuthStore } from "./store/auth";
import { Loading } from "./components/Loading";
import { UserManagement } from "./components/UserManagement";
import ActivityInfo from "./components/activityInfo/ActivityInfo";
import { CreateNewUser } from "./components/CreateNewUser";
import { CreateNewActivity } from "./components/CreateNewActivity";
import Activity from "./components/Activity";
import VolunteerInfo from "./components/VolunteerInfo";
import ServiceProviderInfo from "./components/ServiceProviderInfo";
export default function App(props: { disableCustomTheme?: boolean }) {
  const { direction } = useContext(DirectionContext); // Use DirectionContext to toggle direction
  const [loading, setLoading] = useAuthStore((state) => [
    state.loading,
    state.setLoading,
  ]);

  useEffect(() => {
    setLoading(true);
    setUser();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Protected Route with Layout as default */}
            <Route
              path="/"
              element={
                <Layout>
                  <h2>Welcome to the dashboard</h2>
                </Layout>
              }
            />
            <Route
              path="/user-management"
              element={
                <Layout>
                  <UserManagement />
                </Layout>
              }
            />
            <Route
              path="/activity-management"
              element={
                <Layout>
                  <Activity />
                </Layout>
              }
            />
            <Route
              path="/activity-information"
              element={
                <Layout>
                  <ActivityInfo />
                </Layout>
              }
            />
            <Route
              path="/volunteer-information"
              element={
                <Layout>
                  <VolunteerInfo />
                </Layout>
              }
            />

            <Route
              path="/serviceprovider-information"
              element={
                <Layout>
                  <ServiceProviderInfo/>
                </Layout>
              }
            />

            <Route
              path="/create-new-user"
              element={
                <Layout>
                  <CreateNewUser />
                </Layout>
              }
            />
            {/* Sign In page */}
            <Route
              path="/sign-in"
              element={
                <Stack
                  spacing={2}
                  sx={{
                    alignItems: "center",
                    pb: 10,
                    mx: 3,
                    mt: { xs: 8, md: 0 },
                  }}
                  dir={direction}
                >
                  <Header />
                  <SignIn />
                </Stack>
              }
            />
            {/* Register page (not protected) */}
            {/* <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Register />
              </>
            }
          /> */}
          </Routes>
        </BrowserRouter>
      )}
    </AppTheme>
  );
}

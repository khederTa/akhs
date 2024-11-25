import CssBaseline from "@mui/material/CssBaseline";
import AppTheme, { DirectionContext } from "./shared-theme/AppTheme";
import { useContext, useEffect } from "react";
import { setUser } from "./utils/auth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import { Stack, TextField } from "@mui/material";
import { Loading } from "./components/Loading";
import { UserManagement } from "./components/UserManagement";
import ActivityInfo from "./components/activityInfo/ActivityInfo";
import CreateNewUser from "./components/CreateNewUser";
import Activity from "./components/Activity";
import VolunteerInfo from "./components/VolunteerInfo";
import ServiceProviderInfo from "./components/ServiceProviderInfo";
import { ActivityTypes } from "./components/ActivityTypes";
import { CreateActivityType } from "./components/CreateActivityType";
import { Packages } from "./components/Packages";
import { CreatePackage } from "./components/CreatePackage";
import Department from "./components/Department";
import Position from "./components/Position";
import CreateNewDepartment from "./components/CreateNewDepartment";
import CreateNewPosition from "./components/CreateNewPosition";
import Volunteer from "./components/Volunteer";
import ServiceProvider from "./components/ServiceProvider";
import ActivitySummary from "./components/ActivitySummary";
import VolunteerPage from "./components/VolunteerPage";
import { usePermissionStore } from "./store/permissionStore";
import PermissionInitializer from "./components/PermissionInitializer";
import { useAuthStore } from "./store/auth";
import InvitedVolunteer from "./components/InvitedVolunteer";
import ExecuteActivity from "./components/ExecuteActivity";
export default function App(props: { disableCustomTheme?: boolean }) {
  const { direction } = useContext(DirectionContext); // Use DirectionContext to toggle direction
  const authLoading = useAuthStore((state) => state.loading);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const loggedIn = isLoggedIn();
  // const user = useAuthStore((state) => state.allUserData);
  const permissionsLoading = usePermissionStore(
    (state) => state.permissionsLoading
  );
  const { permissions } = usePermissionStore((state) => state);

  useEffect(() => {
    setUser();
  }, []);

  // useEffect(() => {

  // }, [user])

  useEffect(() => {
    console.log({ authLoading });
    console.log({ permissionsLoading });
  }, [authLoading, permissionsLoading]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      {!authLoading && <PermissionInitializer />}
      {authLoading || permissionsLoading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Protected Route with Layout as default */}
            <Route
              path="/"
              element={
                permissions["read_home"] ? (
                  <Layout>
                    <h2>Welcome to the dashboard</h2>
                    <TextField type="time" />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/sign-in" replace />
                )
              }
            />
            <Route
              path="/user-management"
              element={
                permissions["read_user"] ? (
                  <Layout>
                    <UserManagement />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/activity-management"
              element={
                permissions["read_activity"] ? (
                  <Layout>
                    <Activity />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/activity-information"
              element={
                permissions["create_activity"] ? (
                  <Layout>
                    <ActivityInfo />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/activity-summary"
              element={
                <Layout>
                  <ActivitySummary />
                </Layout>
              }
            />
            <Route
              path="/invited-volunteer"
              element={
                <Layout>
                  <InvitedVolunteer />
                </Layout>
              }
            />

            <Route
              path="/volunteer"
              element={
                permissions["read_volunteer"] ? (
                  <Layout>
                    <Volunteer />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/volunteer-information"
              element={
                permissions["create_volunteer"] ? (
                  <Layout>
                    <VolunteerInfo />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/volunteer-page"
              element={
                <Layout>
                  <VolunteerPage />
                </Layout>
              }
            />
            <Route
              path="/execute-activity"
              element={
                <Layout>
                  <ExecuteActivity />
                </Layout>
              }
            />

            <Route
              path="/serviceprovider"
              element={
                permissions["read_serviceProvider"] ? (
                  <Layout>
                    <ServiceProvider />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/serviceprovider-information"
              element={
                permissions["create_serviceProvider"] ? (
                  <Layout>
                    <ServiceProviderInfo />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/create-new-user"
              element={
                permissions["create_user"] ? (
                  <Layout>
                    <CreateNewUser />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/activity-modules"
              element={
                permissions["read_activityType"] ? (
                  <Layout>
                    <ActivityTypes />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/new-activity-module"
              element={
                permissions["create_activityType"] ? (
                  <Layout>
                    <CreateActivityType />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/packages"
              element={
                permissions["read_package"] ? (
                  <Layout>
                    <Packages />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/new-package"
              element={
                permissions["create_package"] ? (
                  <Layout>
                    <CreatePackage />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/departments"
              element={
                permissions["read_department"] ? (
                  <Layout>
                    <Department />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/new-department"
              element={
                permissions["create_department"] ? (
                  <Layout>
                    <CreateNewDepartment />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/position"
              element={
                permissions["read_position"] ? (
                  <Layout>
                    <Position />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/new-position"
              element={
                permissions["create_position"] ? (
                  <Layout>
                    <CreateNewPosition />
                  </Layout>
                ) : (
                  !permissionsLoading &&
                  !loggedIn && <Navigate to="/" replace />
                )
              }
            />
            {/* Sign In page */}

            <Route
              path="/sign-in"
              element={
                !loggedIn ? (
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
                ) : (
                  <Navigate to="/" replace />
                )
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

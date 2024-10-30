import CssBaseline from "@mui/material/CssBaseline";
import AppTheme, { DirectionContext } from "./shared-theme/AppTheme";
import { useContext, useEffect, useState } from "react";
import { setUser } from "./utils/auth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import { Stack } from "@mui/material";
import { Loading } from "./components/Loading";
import { UserManagement } from "./components/UserManagement";
import ActivityInfo from "./components/activityInfo/ActivityInfo";
import { CreateNewUser } from "./components/CreateNewUser";
import Activity from "./components/Activity";
import VolunteerInfo from "./components/VolunteerInfo";
import ServiceProviderInfo from "./components/ServiceProviderInfo";
import { ActivityTypes } from "./components/ActivityTypes";
import { CreateActivityType } from "./components/CreateActivityType";
import { Packages } from "./components/Packages";
import { CreatePackage } from "./components/CreatePackage";
import Department from "./components/Department";
import Position from "./components/Position";
import CreateNewDepartment from "./components/CreateNewDepartment"
import CreateNewPosition from "./components/CreateNewPosition";
import Volunteer from "./components/Volunteer";
import ServiceProvider from "./components/ServiceProvider";
export default function App(props: { disableCustomTheme?: boolean }) {
  const { direction } = useContext(DirectionContext); // Use DirectionContext to toggle direction
  const [loading, setLoading] = useState(true)

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
              path="/volunteer"
              element={
                <Layout>
                  <Volunteer/>
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
              path="/serviceprovider"
              element={
                <Layout>
                  <ServiceProvider/>
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
            <Route
              path="/activity-types"
              element={
                <Layout>
                  <ActivityTypes />
                </Layout>
              }
            />
            <Route
              path="/new-activity-type"
              element={
                <Layout>
                  <CreateActivityType />
                </Layout>
              }
            />
            <Route
              path="/packages"
              element={
                <Layout>
                  <Packages />
                </Layout>
              }
            />
            <Route
              path="/new-package"
              element={
                <Layout>
                  <CreatePackage />
                </Layout>
              }
            />
            <Route
              path="/departments"
              element={
                <Layout>
                  <Department/>
                </Layout>
              }
            />
             <Route
              path="/new-department"
              element={
                <Layout>
                  <CreateNewDepartment/>
                </Layout>
              }
            />
            <Route
              path="/position"
              element={
                <Layout>
                  <Position/>
                </Layout>
              }
            />
            <Route
              path="/new-position"
              element={
                <Layout>
                  <CreateNewPosition/>
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

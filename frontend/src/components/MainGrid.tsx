/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "./Copyright";
import axios from "../utils/axios";
import { useTranslation } from "react-i18next";
import StatCard, { StatCardProps } from "./StatCard";
import CustomDateRenderer from "./CustomDateRenderer";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Loading } from "./Loading";
import { usePermissionStore } from "../store/permissionStore";
import { useNavigate } from "react-router-dom";
import { Layout } from "./Layout";

export default function MainGrid() {
  const [volunteers, setVolunteers] = React.useState<any>(null);
  const [users, setUsers] = React.useState<any>(null);
  const [serviceProviders, setServiceProviders] = React.useState<any>(null);
  const [activity, setActivity] = React.useState<any>(null);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation();
  const { userRole } = usePermissionStore((state) => state);
  const navigate = useNavigate();

  if (userRole === "data entry") {
    navigate("/activity-management");
  }
  const paginationModel = { page: 0, pageSize: 5 };
  const columns: any[] = [
    {
      field: "id",
      headerName: t("id"),
      minWidth: 100,
      sortable: true,
      editable: false,
    },
    {
      field: "title",
      headerName: t("title"),
      minWidth: 200,
    },
    {
      field: "activityType",
      headerName: t("activity type"),
      minWidth: 250,
    },
    {
      field: "numSessions",
      headerName: t("numSessions"),
      minWidth: 150,
    },
    {
      field: "minSessions",
      headerName: t("minSessions"),
      minWidth: 150,
    },
    {
      field: "startDate",
      headerName: t("startDate"),
      minWidth: 200,
      renderCell: (params: { value: string | Date }) => (
        <CustomDateRenderer value={params.value} />
      ),
    },
    {
      field: "done",
      headerName: t("done"),
      minWidth: 200,
      renderCell: (params: { value: boolean }) =>
        params?.value === true ? t("done") : t("not done"),
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [volunteerRes, userRes, serviceProviderRes, activityRes] =
          await Promise.all([
            axios.get("/volunteer"),
            axios.get("/user"),
            axios.get("/serviceprovider"),
            axios.get("/activity"),
          ]);

        setVolunteers(volunteerRes.data);
        setUsers(userRes.data);
        setServiceProviders(serviceProviderRes.data);
        setActivity(activityRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    async function fetchActivityData() {
      try {
        // Fetch the activities first
        const activityResponse = await axios.get("activity");
        const activities = activityResponse.data;
        const filteredActivivty = activities.filter((activity: any) => {
          return !activity.done;
        });
        console.log("activivtys is", activities);
        console.log("filtered activivty is", filteredActivivty);

        // Fetch volunteer attended activity data for each activity
        const activityRows: any = filteredActivivty.map((activity: any) => {
          // Construct the row with the fetched data
          return {
            id: activity?.id,
            done: activity?.done,
            title: activity?.title,
            activityType: activity?.ActivityType?.name,
            numSessions: activity?.numSessions,
            minSessions: activity?.minSessions,
            startDate: activity?.startDate,
          };
        });

        setLoading(false);
        setRows(activityRows);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        setLoading(false); // Ensure loading is stopped in case of error
      }
    }
    fetchActivityData();

    fetchData();
  }, []);

  const data: StatCardProps[] = [
    {
      title: t("users"),
      value: users?.length || 0,
    },
    {
      title: t("volunteers"),
      value: volunteers?.length || 0,
    },
    {
      title: t("service providers"),
      value: serviceProviders?.length || 0,
    },
    {
      title: t("activities"),
      value: activity?.length || 0,
    },
  ];
  console.log("user is", users);

  return loading ? (
    <Loading />
  ) : (
    <Layout>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        {/* cards */}
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          {t("statistics")}
        </Typography>
        <Grid
          container
          spacing={2}
          columns={12}
          sx={{ mb: (theme) => theme.spacing(2) }}
        >
          {data.map((card, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>
        <Typography component="h2" variant="h6" sx={{ mb: 2, mt: 10 }}>
          {t("upcoming activities")}
        </Typography>
        <Paper sx={{ height: 400, width: "99%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            // processRowUpdate={handleProcessRowUpdate}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            getRowId={(row: any) => row.id} // Ensure the correct row ID is used
            disableColumnFilter
            disableColumnMenu
          />
        </Paper>

        <Copyright sx={{ my: 4 }} />
      </Box>
    </Layout>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import useSessionStore from "../store/activityStore";
import { useTranslation } from "react-i18next";
import FilterHeader from "./FilterHeader";
import { Box, Button, Paper } from "@mui/material";
import GridCustomToolbar from "./GridCustomToolbar";
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AlertNotification from "./AlertNotification";
type VolunteerRow = {
  id: number;
  fullName: string;
  [key: string]: any; // Dynamic columns for session attendance
};
const paginationModel = { page: 0, pageSize: 5 };

export default function ExecuteActivity() {
  const location = useLocation();
  const [rows, setRows] = useState<VolunteerRow[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activityId, setActivityId] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  const {
    filteredRows,
    sortModel,
    filterModel,
    filterVisibility,
    setFilterVisibility,
    handleTextFilterChange,
    clearFilter,
    clearAllFilters,
    handleSortClick,
  } = useGridFilterSort({
    initialFilterModel: {
      fullName: "",
    },
    initialFilterVisibility: {
      fullName: false,
    },
    rows, // your initial rows data
  });
  const {
    title,
    setTitle,
    setDone,
    minSessions,
    setNumSessions,
    setMinSessions,
    setDepartment,
    setActivityType,
    sessions,
    addNewSession,
    addSessionIds,
    setInvitedVolunteerIds,
    invitedVolunteerIds,
    resetStore,
  } = useSessionStore((state) => ({
    title: state.title,
    setTitle: state.setTitle,
    setDone: state.setDone,
    minSessions: state.minSessions,
    setNumSessions: state.setNumSessions,
    setMinSessions: state.setMinSessions,
    setDepartment: state.setDepartment,
    setActivityType: state.setActivityType,
    sessions: state.sessions,
    addNewSession: state.addNewSession,
    addSessionIds: state.addSessionIds,
    invitedVolunteerIds: state.invitedVolunteerIds,
    setInvitedVolunteerIds: state.setInvitedVolunteerIds,
    resetStore: state.resetStore,
  }));

  useEffect(() => {
    resetStore();
    async function fetchActivityData() {
      const response = await axios.get(`/activity/${location.state.id}`);
      console.log(response);

      if (response.status === 200) {
        const activityData = response.data;
        setActivityId(response.data.id);
        setTitle(activityData.title);
        setDone(activityData.done);
        setNumSessions(activityData.numSessions);
        setMinSessions(activityData.minSessions);
        setDepartment(activityData.Department);
        setActivityType(activityData.ActivityType);

        const newSessions = activityData.Sessions.map((session: any) => ({
          key: session.id,
          sessionName: session.name,
          dateValue: session.date,
          hallName: session.hall_name,
          startTime: session.startTime,
          endTime: session.endTime,
        }));
        newSessions.forEach(
          (session: {
            key: any;
            sessionName?: string;
            serviceProviders?: any[] | undefined;
            trainers?: any[] | undefined;
            hallName?: string;
            dateValue?: any;
            providerNames?: any[];
            trainerName?: any[];
            startTime?: any;
            endTime?: any;
          }) => {
            addNewSession(session as any);
            addSessionIds(session.key);
          }
        );

        const volunteers = activityData.Volunteers.map((volunteer: any) => {
          const attendance = activityData.Sessions.reduce(
            (acc: any, session: any) => ({
              ...acc,
              [`session_${session.id}`]: session.Attendees.some(
                (attendee: any) =>
                  attendee.volunteerId === volunteer.volunteerId &&
                  attendee.VolunteerAttendedSessions?.status === "attended"
              ),
            }),
            {}
          );
          return {
            id: volunteer.volunteerId,
            fullName: `${volunteer.Person.fname} ${volunteer.Person.lname}`,
            notes: volunteer.VolunteerAttendedActivity.notes || "",
            volunteerAttendedActivity:
              volunteer.VolunteerAttendedActivity.status === "attended",

            ...attendance,
          };
        });
        setRows(volunteers);
      }
    }
    fetchActivityData();
  }, [
    location.state.id,
    setTitle,
    setDone,
    setNumSessions,
    setMinSessions,
    setDepartment,
    setActivityType,
    addNewSession,
    addSessionIds,
    resetStore,
  ]);

  const columns: GridColDef[] = useMemo(() => {
    const sessionColumns = sessions.map((session) => ({
      field: `session_${session.key}`,
      headerName: session.sessionName,
      width: 150,
      sortable: false,
      hideSortIcons: true,
      renderCell: (params: GridRenderCellParams) => (
        <input
          type="checkbox"
          checked={params.value || false}
          onChange={async (e) => {
            let flag = false;
            if (e.target.checked) {
              let numberOfAttendedSession = 1;
              for (const key in params.row) {
                if (key.startsWith("session_") && params.row[key] === true)
                  numberOfAttendedSession++;
              }
              if (numberOfAttendedSession >= minSessions) {
                flag = true;
              } else {
                flag = false;
              }
            }
            console.log({ flag });
            const updatedRows = rows.map((row) =>
              row.id === params.row.id
                ? {
                    ...row,
                    [params.field]: e.target.checked,
                    volunteerAttendedActivity: flag,
                  }
                : row
            );
            setRows(updatedRows);
          }}
        />
      ),
    }));

    return [
      { field: "id", headerName: t("id"), minWidth: 100, sortable: true },
      {
        field: "fullName",
        headerName: t("fullName"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"fullName"}
            field={"fullName"}
            filterModel={filterModel}
            sortModel={sortModel}
            filterVisibility={filterVisibility}
            handleSortClick={handleSortClick}
            handleFilterChange={handleTextFilterChange}
            setFilterVisibility={setFilterVisibility}
            clearFilter={clearFilter}
          />
        ),
      },
      ...sessionColumns,
      {
        field: "volunteerAttendedActivity",
        headerName: t("activity attended"),
        width: 250,
        sortable: false,
        hideSortIcons: true,
        renderCell: (params: GridRenderCellParams) => (
          <input
            type="checkbox"
            checked={params.value || false}
            onChange={async (e) => {
              if (e.target.checked) {
                let numberOfAttendedSession = 0;
                for (const key in params.row) {
                  if (key.startsWith("session_") && params.row[key] === true)
                    numberOfAttendedSession++;
                }
                if (numberOfAttendedSession < minSessions) {
                  return;
                }
              }
              console.log(params);
              const updatedRows = rows.map((row) =>
                row.id === params.row.id
                  ? { ...row, [params.field]: e.target.checked }
                  : row
              );
              setRows(updatedRows);
            }}
          />
        ),
      },
      {
        field: "notes",
        headerName: t("notes"),
        width: 300,
        sortable: false,
        hideSortIcons: true,
        editable: true,
      },
    ];
  }, [
    clearFilter,
    filterModel,
    filterVisibility,
    handleSortClick,
    handleTextFilterChange,
    minSessions,
    rows,
    sessions,
    setFilterVisibility,
    sortModel,
    t,
  ]);
  const handleSelectionChange = (newSelection: any[]) => {
    const newSelectedRows: any = newSelection.map((selected) => {
      return filteredRows.find((row) => row.id === selected);
    });
    setInvitedVolunteerIds(newSelection as any);
    setSelectedRows(newSelectedRows);
  };
  const handleSave = async () => {
    try {
      for (const row of rows) {
        console.log({ row });
        const rowSessions = Object.fromEntries(
          Object.entries(row).filter(([key]) => key.startsWith("session_"))
        );
        console.log({
          sessions: Object.fromEntries(
            Object.entries(row).filter(([key]) => key.startsWith("session_"))
          ),
        });

        await axios.put(`/volunteerAttendedActivity/${row.id}/${activityId}`, {
          notes: row.notes, // Save notes
          attended: row.volunteerAttendedActivity, // Save activity attendance
        });
        Object.keys(rowSessions).forEach(async (key) => {
          await axios.put(
            `/volunteerAttendedSession/${row.id}/${key.split("_")[1]}`,
            { attended: rowSessions[key] }
          );
        });
      }
      setAlertMessage("Changes saved successfully!");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("An error occurred while saving changes.");
    } finally {
      setAlertOpen(true);
    }
  };

  const handleSaveAndComplete = async () => {
    await handleSave();
    try {
      await axios.put(`/activity/${activityId}`, { done: true });
      setDone(true);
      setAlertMessage("Activity saved and marked as complete!");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Failed to markactivity  as complete:", error);
      alert("An error occurred while completing the activity.");
    } finally {
      setAlertOpen(true);
    }
  };

  const handleExit = () => {
    navigate("/activity-management");
  };
  const handleProcessRowUpdate = (newRow: GridRowModel) => {
    setRows((prev: any) =>
      prev.map((row: any) => (row.id === newRow.id ? newRow : row))
    );
    return newRow;
  };

  return (
    <>
      <AlertNotification
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleAlertClose}
      />
      <h2>{title}</h2>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          getRowId={(row) => row.id} // Ensure the correct row ID is used
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          disableColumnFilter
          disableColumnMenu
          localeText={{
            toolbarColumns: t("columns"),
            toolbarDensity: t("density"),
          }}
          slots={{
            toolbar: () => (
              <GridCustomToolbar
                clearAllFilters={clearAllFilters}
                rows={selectedRows}
                navigateTo=""
                mode={"exe"}
              />
            ),
          }}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection // Enable checkboxes for row selection
          onRowSelectionModelChange={(newSelection: any) =>
            handleSelectionChange(newSelection)
          }
          rowSelectionModel={invitedVolunteerIds}
          disableRowSelectionOnClick
        />
      </Paper>
      <Box justifyContent={"flex-start"} mt={2}>
        <Button
          onClick={handleSaveAndComplete}
          sx={{ minWidth: "250px", margin: "0 15px", gap: "10px" }}
          variant="contained"
        >
          <AssignmentTurnedInIcon fontSize="small" />
          {t("save and complete")}
        </Button>
        <Button
          onClick={handleSave}
          sx={{ minWidth: "150px", margin: "0 15px", gap: "10px" }}
          variant="outlined"
        >
          <SaveIcon fontSize="small" />
          {t("save")}
        </Button>
        <Button
          onClick={handleExit}
          sx={{ minWidth: "150px", margin: "0 15px", gap: "10px" }}
          variant="outlined"
        >
          <CloseIcon fontSize="small" />
          {t("exit")}
        </Button>
      </Box>
    </>
  );
}

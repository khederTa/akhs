import React from 'react'
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
import AlertNotification from "./AlertNotification";
import { usePermissionStore } from "../store/permissionStore";
import dayjs from "dayjs";

const AttendedVolunteerReport = () => {
  type VolunteerRow = {
    id: number;
    fullName: string;
    [key: string]: any; // Dynamic columns for session attendance
  };
  const paginationModel = { page: 0, pageSize: 5 };
  const location = useLocation();
  const [rows, setRows] = useState<VolunteerRow[]>([]);
  const [activityId, setActivityId] = useState();
  const { userRole } = usePermissionStore((state) => state);

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
          dateValue: dayjs(session.date).format("YYYY-MM-DD"), // Format the date value
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
              [`${session.name}_${session.id}`]: session.Attendees.some(
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
      
      field: `${session.sessionName}_${session.key}`, // Use the session name directly
      headerName: (`${session.sessionName} in ${session.dateValue}` ),
      width: 200,
      sortable: false,
      hideSortIcons: true,
      renderCell: (params: GridRenderCellParams) => (
        <input
          type="checkbox"
          checked={params.value || false}
       
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
         
          />
        ),
      },
      {
        field: "notes",
        headerName: t("notes"),
        width: 300,
        sortable: false,
        hideSortIcons: true,
       
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



  const [columnVisibilityModel, setColumnVisibilityModel] = useState<any>({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsToExport, setSelectedRowsToExport] = useState<any>([]);
  const [selectedRowsIds, setSelectedRowsIds] = useState<any[]>([]);
  const handleSelectionChange = (newSelection: any[]) => {
    const newSelectedRows: any = newSelection.map((selected) => {
      return rows.find((row: any) => row.id === selected);
    });
    setSelectedRowsIds(newSelection);
    setSelectedRows(newSelectedRows);
  };
  console.log("sessions in excute activity is" , sessions);
  

  useEffect(() => {
    // Filter rows to include only the visible columns
    const processedRows = selectedRows.map((row) => {
      const newRow: any = {};
      for (const col in row) {
        if (columnVisibilityModel[col] !== false) {
          // Include only if the column is visible
          newRow[col] = row[col];
        }
      }
      return newRow;
    });

    // Create a new array with translated keys
    const translatedRows = processedRows.map((row: any) => {
      if (!row) return;
      const translatedRow: any = {};
      Object.keys(row).forEach((key) => {
        if (
          sessions.some((session) => session.sessionName === key) ||
          key.toLowerCase().includes("volunteerAttendedActivity".toLowerCase())
        ) {
          translatedRow[key] = row[key] ? t("attended") : "";
        } else if (
          !key.toLowerCase().includes("id") &&
          !(key.toLowerCase() === "file") &&
          !(key.toLowerCase() === "active_status")
        )
          translatedRow[t(key)] = row[key];
      });

      return translatedRow;
    });

    setSelectedRowsToExport(translatedRows);
  }, [selectedRows, columnVisibilityModel, t, sessions]);

  // useEffect(() => console.log(selectedRows), [selectedRows]);
  // useEffect(() => console.log(selectedRowsToExport), [selectedRowsToExport]);
  // useEffect(() => console.log(columnVisibilityModel), [columnVisibilityModel]);

  return (
    <>
      <AlertNotification
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleAlertClose}
      />
      <h2>{title}</h2>
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          getRowId={(row) => row.id} // Ensure the correct row ID is used
          columns={columns}
          
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
                rows={selectedRowsToExport}
                navigateTo=""
                mode={"exe"}
              />
            ),
          }}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          onRowSelectionModelChange={(newSelection: any) =>
            handleSelectionChange(newSelection)
          }
          rowSelectionModel={selectedRowsIds}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(model) =>
            setColumnVisibilityModel(model)
          }
          checkboxSelection // Enable checkboxes for row selection
          keepNonExistentRowsSelected
          disableRowSelectionOnClick
        />
      </Paper>
   
    </>
  );
}

export default AttendedVolunteerReport
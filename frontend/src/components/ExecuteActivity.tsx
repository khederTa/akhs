/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import axios from "../utils/axios";
import useSessionStore from "../store/activityStore";
import { useTranslation } from "react-i18next";
import FilterHeader from "./FilterHeader";
import { Paper } from "@mui/material";
import GridCustomToolbar from "./GridCustomToolbar";
import { useGridFilterSort } from "../hooks/useGridFilterSort";

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

  const {
    filteredRows,
    sortModel,
    filterModel,
    filterVisibility,
    setFilteredRows,
    setFilterVisibility,
    handleTextFilterChange,
    handleDateFilterChange,
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
    done,
    setDone,
    numSessions,
    setNumSessions,
    minSessions,
    setMinSessions,
    department,
    setDepartment,
    activityType,
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
    done: state.done,
    setDone: state.setDone,
    numSessions: state.numSessions,
    setNumSessions: state.setNumSessions,
    minSessions: state.minSessions,
    setMinSessions: state.setMinSessions,
    department: state.department,
    setDepartment: state.setDepartment,
    activityType: state.activityType,
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
            // activityData.Sessions.filter((session: any) =>
            //   session.Attendees.some(
            //     (attendee: any) =>
            //       attendee.volunteerId === volunteer.volunteerId &&
            //       attendee.VolunteerAttendedSessions?.status === "attended"
            //   )
            // ).length >= activityData.minSessions,
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
            const updatedRows = rows.map((row) =>
              row.id === params.row.id
                ? { ...row, [params.field]: e.target.checked }
                : row
            );
            setRows(updatedRows);
            await axios.put(
              `/volunteerAttendedSession/${params.row.id}/${session.key}`,
              {
                attended: e.target.checked,
              }
            );
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
              console.log(params);
              const updatedRows = rows.map((row) =>
                row.id === params.row.id
                  ? { ...row, [params.field]: e.target.checked }
                  : row
              );
              setRows(updatedRows);
              await axios.put(
                `/volunteerAttendedActivity/${params.row.id}/${activityId}`,
                {
                  attended: e.target.checked,
                }
              );
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
      },
    ];
  }, [
    activityId,
    clearFilter,
    filterModel,
    filterVisibility,
    handleSortClick,
    handleTextFilterChange,
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
  return (
    <>
      <h1>{title}</h1>
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
                rows={selectedRows}
                navigateTo=""
                mode={"exe"}
              />
            ),
          }}
          onCellEditStop={async (params, event: any) => {
            if (params.field === "notes") {
              const updatedRows = rows.map((row) =>
                row.id === params.id
                  ? { ...row, notes: (event.target as HTMLInputElement).value }
                  : row
              );
              setRows(updatedRows);
              await axios.put(
                `/volunteerAttendedActivity/${params.id}/${activityId}`,
                {
                  notes: (event.target as HTMLInputElement).value,
                }
              );
            }
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
    </>
  );
}

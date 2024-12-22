/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { Loading } from "./Loading";
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import { useTranslation } from "react-i18next";
import FilterHeader from "./FilterHeader";
import FilterBooleanHeader from "./FilterBooleanHeader";
import GridCustomToolbar from "./GridCustomToolbar";
import CustomDateRenderer from "./CustomDateRenderer";
import DateFilterHeader from "./DateFilterHeader";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskIcon from "@mui/icons-material/Task";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { usePermissionStore } from "../store/permissionStore";
import { Tooltip } from "@mui/material";
import useSessionStore from "../store/activityStore";
const Activity = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const resetStore = useSessionStore((state) => state.resetStore);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { permissions } = usePermissionStore((state) => state);
  const { userRole } = usePermissionStore((state) => state);
  console.log({ permissions, userRole });
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
      title: "",
      numSessions: 0,
      minSessions: 0,
      startDate: "",
      done: false,
    },
    initialFilterVisibility: {
      title: false,
      numSessions: false,
      minSessions: false,
      startDate: false,
      done: false,
    },
    rows, // your initial rows data
  });
  console.log("log activitys", rows);
  // console.log("log activitys" , rows);

  const paginationModel = { page: 0, pageSize: 5 };
  const columns: any[] = [
    {
      field: "id",
      headerName: t("id"),
      minWidth: 125,
      sortable: true,
      editable: false,
    },
    {
      field: "title",
      headerName: t("title"),
      minWidth: 200,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <FilterHeader
          key={"title"}
          field={"title"}
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
    {
      field: "activityType",
      headerName: t("activity type"),
      minWidth: 250,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <FilterHeader
          key={"activity type"}
          field={"activity type"}
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
      sortable: false,
      hideSortIcons: true,
      renderCell: (params: { value: string | Date }) => (
        <CustomDateRenderer value={params.value} />
      ),
      renderHeader: () => (
        <DateFilterHeader
          key={"startDate"}
          field={"startDate"}
          filterModel={filterModel}
          sortModel={sortModel}
          filterVisibility={filterVisibility}
          handleSortClick={handleSortClick}
          handleFilterChange={handleDateFilterChange}
          setFilterVisibility={setFilterVisibility}
          clearFilter={clearFilter}
        />
      ),
    },
    {
      field: "done",
      headerName: t("done"),
      minWidth: 200,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <FilterBooleanHeader
          key={"done"}
          field={"done"}
          filterModel={filterModel}
          sortModel={sortModel}
          filterVisibility={filterVisibility}
          handleSortClick={handleSortClick}
          handleFilterChange={handleTextFilterChange}
          setFilterVisibility={setFilterVisibility}
          clearFilter={clearFilter}
        />
      ),
      renderCell: (params: { value: boolean }) =>
        params?.value === true ? t("done") : t("not done"),
    },

    {
      field: "NumberOfAttendedActivity",
      headerName: t("Number Of Attended Activity"),
      minWidth: 250,
    },
    {
      field: "NumberOfMales",
      headerName: t("Number Of Males"),
      minWidth: 150,
    },
    {
      field: "NumberOfFemales",
      headerName: t("Number Of Females"),
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: t("actions"),
      type: "actions",
      minWidth: 250,
      getActions: ({ id }: any) => {
        const row: any = rows.find((item: any) => item.id === id);
        return [
          <Tooltip title={t("execute")}>
            <GridActionsCellItem
              icon={<PlayArrowIcon />}
              label="Execute"
              onClick={() => navigate("/execute-activity", { state: { id } })}
            />
          </Tooltip>,
          (permissions["update_activity"] && row.done !== true) ||
          userRole === "admin" ? (
            <Tooltip title={t("edit")}>
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                onClick={() => navigate("/activity-summary", { state: { id } })}
              />
            </Tooltip>
          ) : null,
          row.done === true && (
            <Tooltip title={t("activity preview")}>
              <GridActionsCellItem
                icon={<TaskIcon />}
                label="activity preview"
                onClick={() => navigate("/activity-report", { state: { id } })}
              />
            </Tooltip>
          ),
          <Tooltip title={t("attended volunteers")}>
            <GridActionsCellItem
              icon={<AssignmentIndIcon />}
              label="attended volunteers"
              onClick={() =>
                navigate("/attended-volunteer-report", { state: { id } })
              }
            />
          </Tooltip>,
          <Tooltip title={t("invited volunteers")}>
            <GridActionsCellItem
              icon={<AssignmentIcon />}
              label="invited volunteers"
              onClick={() =>
                navigate("/invited-volunteer-report", { state: { id } })
              }
            />
          </Tooltip>,
        ].filter(Boolean); // Filter out null values
      },
    },
  ];

  useEffect(() => {
    async function fetchActivityData() {
      try {
        // Fetch the activities first
        const activityResponse = await axios.get("activity");
        const activities = activityResponse.data;
        console.log("activivtys is", activities);

        // Fetch volunteer attended activity data for each activity
        const activityRows: any = await Promise.all(
          activities.map(async (activity: any) => {
            const fetchedAttendedResponse = await axios.get(
              `volunteerAttendedActivity/${activity?.id}`
            );
            console.log("fetchedAttendedResponse is", fetchedAttendedResponse);
            const fetchedAttended = fetchedAttendedResponse.data;
            const fetchedAttendedMale = fetchedAttendedResponse.data.filter(
              (attend: any) => {
                return attend?.gender === "Male";
              }
            );
            const fetchedAttendedFemale = fetchedAttendedResponse.data.filter(
              (attend: any) => {
                return attend?.gender === "Female";
              }
            );
            console.log("fetchedAttendedMale", fetchedAttendedMale);
            // Construct the row with the fetched data
            return {
              id: activity?.id,
              done: activity?.done,
              title: activity?.title,
              activityType: activity?.ActivityType?.name,
              numSessions: activity?.numSessions,
              minSessions: activity?.minSessions,
              startDate: activity?.startDate,
              NumberOfAttendedActivity: fetchedAttended?.length || 0, // Adjust based on API response structure
              NumberOfMales: fetchedAttendedMale?.length || 0,
              NumberOfFemales: fetchedAttendedFemale?.length || 0,
            };
          })
        );

        setLoading(false);
        setRows(activityRows);
        setFilteredRows(activityRows);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        setLoading(false); // Ensure loading is stopped in case of error
      }
    }
    resetStore();
    fetchActivityData();
  }, [resetStore, setFilteredRows]);

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
  console.log("rows is ", rows);

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
          !key.toLowerCase().includes("id") &&
          !(key.toLowerCase() === "file") &&
          !(key.toLowerCase() === "active_status")
        )
          translatedRow[t(key)] = row[key];
      });

      return translatedRow;
    });

    setSelectedRowsToExport(translatedRows);
  }, [selectedRows, columnVisibilityModel, t]);

  // useEffect(() => console.log(selectedRows), [selectedRows]);
  // useEffect(() => console.log(selectedRowsToExport), [selectedRowsToExport]);
  // useEffect(() => console.log(columnVisibilityModel), [columnVisibilityModel]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Paper sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            // processRowUpdate={handleProcessRowUpdate}
            initialState={{
              pagination: { paginationModel },
              sorting: {
                sortModel: [{ field: "id", sort: "desc" }], // Default sorting model
              },
            }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            getRowId={(row) => row.id} // Ensure the correct row ID is used
            disableColumnFilter
            disableColumnMenu
            slots={{
              toolbar: () => (
                <GridCustomToolbar
                  clearAllFilters={clearAllFilters}
                  rows={selectedRowsToExport}
                  navigateTo={""}
                  mode="addActivity"
                />
              ),
            }}
            editMode="row"
            localeText={{
              toolbarColumns: t("columns"),
              toolbarDensity: t("density"),
            }}
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
      )}
    </>
  );
};

export default Activity;

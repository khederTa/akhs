/* eslint-disable @typescript-eslint/no-explicit-any */
// VolunteerPage.tsx
import { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Paper, Box } from "@mui/material";
import axios from "../utils/axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import FilterHeader from "./FilterHeader";
import DateFilterHeader from "./DateFilterHeader";
import CustomDateRenderer from "./CustomDateRenderer";
import QAFilterHeader from "./QAFilterHeader";
import GenderFilterHeader from "./GenderFilterHeader";
import GridCustomToolbar from "./GridCustomToolbar";
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import { useTranslation } from "react-i18next";
import DownloadButton from "./DownloadButton";
import useSessionStore from "../store/activityStore";
import { Loading } from "./Loading";
import dayjs from "dayjs";
import { DirectionContext } from "../shared-theme/AppTheme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SaveIcon from "@mui/icons-material/Save";
export default function VolunteerPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { direction } = useContext(DirectionContext);
  const paginationModel = { page: 0, pageSize: 5 };
  const navigate = useNavigate();
  const [getEligible, setGetEligible] = useState(true);

  // Zustand store session state management
  const {
    sessions,
    title,
    startDate,
    activityType,
    department,
    numSessions,
    minSessions,
  } = useSessionStore((state) => ({
    sessions: state.sessions,
    title: state.title,
    startDate: state.startDate,
    activityType: state.activityType,
    department: state.department,
    numSessions: state.numSessions,
    minSessions: state.minSessions,
  }));

  const handleBack = () => {
    console.log({ sessions });

    navigate("/activity-summary");
  };

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
      fname: "",
      lname: "",
      mname: "",
      momName: "",
      phone: "",
      email: "",
      gender: "",
      study: "",
      work: "",
      address: "",
      nationalNumber: "",
      fixPhone: "",
      compSkills: "",
      koboSkils: "",
      prevVol: "",
      smoking: "",
      bDate: { value: "", operator: "equals", endDate: "" },
    },
    initialFilterVisibility: {
      fname: false,
      lname: false,
      mname: false,
      momName: false,
      phone: false,
      email: false,
      gender: false,
      study: false,
      work: false,
      address: false,
      nationalNumber: false,
      fixPhone: false,
      bDate: false,
      compSkills: false,
      koboSkils: false,
      prevVol: false,
      smoking: false,
    },
    rows, // your initial rows data
  });

  // Fetch volunteers with associated Person data
  useEffect(() => {
    async function fetchVolunteers() {
      setIsLoading(true);
      try {
        let response;
        if (getEligible) {
          response = await axios.get(
            `/volunteer/${activityType.id}/eligible-volunteer`
          );
        } else {
          response = await axios.get("/volunteer");
        }
        console.log("response is", response);
        if (response && response.status === 200) {
          const enrichedData = response.data.map((volunteer: any) => ({
            volunteerId: volunteer.volunteerId,
            active_status: volunteer.active_status,
            ...(volunteer.Person || {}),
            address: `${volunteer?.Person?.Address?.state || ""} - ${
              volunteer?.Person?.Address?.city || ""
            } - ${volunteer?.Person?.Address?.district || ""} - ${
              volunteer?.Person?.Address?.village || ""
            }`,

            personId: volunteer?.Person?.id,
            fileId: volunteer?.Person?.fileId,
            file: volunteer?.Person?.File?.file?.data,
            addressId: volunteer?.Person?.Address?.id,
          }));
          setRows(enrichedData);
          setFilteredRows(enrichedData);
          console.log("enricheddata is ", enrichedData);
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVolunteers();
  }, [activityType, getEligible, setFilteredRows]);
  console.log("the rows is ", rows);

  // Memoized columns definition to prevent re-rendering
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "volunteerId",
        headerName: t("id"),
        minWidth: 100,
        sortable: true,
      },
      {
        field: "fname",
        headerName: t("fname"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"fname"}
            field={"fname"}
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
        field: "lname",
        headerName: t("lname"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"lname"}
            field={"lname"}
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
        field: "mname",
        headerName: t("mname"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"mname"}
            field={"mname"}
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
        field: "momName",
        headerName: t("momName"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"momName"}
            field={"momName"}
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
        field: "phone",
        headerName: t("phone"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"phone"}
            field={"phone"}
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
        field: "email",
        headerName: t("email"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"email"}
            field={"email"}
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
        field: "bDate",
        headerName: "Birth Date",
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderCell: (params) => <CustomDateRenderer value={params.value} />,
        renderHeader: () => (
          <DateFilterHeader
            key={"bDate"}
            field={"bDate"}
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
        field: "gender",
        headerName: t("gender"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <GenderFilterHeader
            key={"gender"}
            field={"gender"}
            filterModel={filterModel}
            sortModel={sortModel}
            filterVisibility={filterVisibility}
            handleSortClick={handleSortClick}
            handleFilterChange={handleTextFilterChange}
            setFilterVisibility={setFilterVisibility}
            clearFilter={clearFilter}
          />
        ),
        type: "singleSelect",
        valueOptions: ["Male", "Female"],
      },
      {
        field: "study",
        headerName: t("study"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"study"}
            field={"study"}
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
        field: "work",
        headerName: t("work"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"work"}
            field={"work"}
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
        field: "nationalNumber",
        headerName: t("nationalNumber"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"nationalNumber"}
            field={"nationalNumber"}
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
        field: "fixPhone",
        headerName: t("fixPhone"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"fixPhone"}
            field={"fixPhone"}
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
        field: "address",
        headerName: t("address"),
        minWidth: 650,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <FilterHeader
            key={"address"}
            field={"address"}
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
        field: "smoking",
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        headerName: t("smoking"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <QAFilterHeader
            key={"smoking"}
            field={"smoking"}
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
        field: "prevVol",
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        headerName: t("prevVol"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <QAFilterHeader
            key={"prevVol"}
            field={"prevVol"}
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
        field: "compSkill",
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        headerName: t("compSkill"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <QAFilterHeader
            key={"compSkill"}
            field={"compSkill"}
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
        field: "koboSkill",
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        headerName: t("koboSkill"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        renderHeader: () => (
          <QAFilterHeader
            key={"koboSkill"}
            field={"koboSkill"}
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
        field: "file",
        headerName: t("cv"),
        hideSortIcons: true,
        sortable: false,
        renderCell: (params) => {
          // console.log(params.row);
          return (
            <DownloadButton
              fileName={`${params.row.fname} CV`}
              fileBinary={params.row.File?.file?.data}
            />
          );
        },
      },
    ],
    [
      clearFilter,
      filterModel,
      filterVisibility,
      handleDateFilterChange,
      handleSortClick,
      handleTextFilterChange,
      setFilterVisibility,
      sortModel,
      t,
    ]
  );

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
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log({ sessions });

    const processedSessions = sessions.map((session) => ({
      ...session,
      dateValue: dayjs(session.dateValue.$d).format("YYYY-MM-DD hh:mm:ss"),
      startTime: dayjs(session.startTime.$d).format("hh:mm:ss"),
      endTime: dayjs(session.endTime.$d).format("hh:mm:ss"),
    }));

    const payload: any = {
      activityData: {
        title,
        activityTypeId: activityType.id,
        departmentId: department.id,
        numSessions,
        minSessions,
        startDate,
      },
      sessionsData: {
        sessions: processedSessions,
      },
      invitedVolunteersData: {
        volunteerIds: selectedRowsIds,
      },
    };
    console.log({ payload });
    const response = await axios.post("/activity", payload);
    console.log(response);

    if (response.status === 200) {
      navigate("/activity-management");
    }
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* <Typography variant="h4">Volunteer Information</Typography>
          <Typography variant="body1">Activity Title: {title}</Typography>
          <Typography variant="body1">Department: {department.name}</Typography>
          <Typography variant="body1">
            Activity Type: {activityType.name}
          </Typography>
          <Typography variant="body1">Sessions: {sessions.length}</Typography>
          <Typography variant="body1">Start Date: {startDate}</Typography> */}
          <Paper sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              getRowId={(row) => row.volunteerId} // Ensure the correct row ID is used
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
                    navigateTo={"/volunteer-information"}
                    mode={"show"}
                    setGetEligible={setGetEligible}
                    getEligible={getEligible}
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

          {direction === "ltr" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="outlined"
                sx={{ mt: 2, mr: 2 }}
                onClick={handleBack}
              >
                <ArrowBackIcon fontSize="small" />{" "}
                {t("back to activity summary")}
              </Button>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
                <SaveIcon fontSize="small" /> {t("create activity")}
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="outlined"
                sx={{ mt: 2, mr: 2 }}
                onClick={handleBack}
              >
                <ArrowForwardIcon fontSize="small" />{" "}
                {t("back to activity summary")}
              </Button>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
                <SaveIcon fontSize="small" /> {t("create activity")}
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
}

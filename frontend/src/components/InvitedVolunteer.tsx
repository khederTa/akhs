/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Paper, Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
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
import axios from "../utils/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { DirectionContext } from "../shared-theme/AppTheme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SaveIcon from "@mui/icons-material/Save";
const InvitedVolunteer = () => {
  const [rows, setRows] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { direction } = useContext(DirectionContext);

  const paginationModel = { page: 0, pageSize: 5 };
  const navigate = useNavigate();
  const [getEligible, setGetEligible] = useState(false);

  // Zustand store session state management
  const {
    sessions,
    title,
    startDate,
    activityType,
    department,
    invitedVolunteerIds,
    setInvitedVolunteerIds,
    numSessions,
    minSessions,
    activityData,
    setMode,
  } = useSessionStore((state) => ({
    sessions: state.sessions,
    title: state.title,
    startDate: state.startDate,
    activityType: state.activityType,
    department: state.department,
    invitedVolunteerIds: state.invitedVolunteerIds,
    setInvitedVolunteerIds: state.setInvitedVolunteerIds,
    numSessions: state.numSessions,
    minSessions: state.minSessions,
    activityData: state.activityData,
    setMode: state.setMode,
  }));

  console.log("activityData in invited volunteer is", activityData);
  console.log("invitedVolunteerIds is ", invitedVolunteerIds);
  const activivtyId = activityData.id;
  console.log("activivtyId is", activivtyId);
  const handleBack = () => {
    navigate("/activity-summary");
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setMode("");
    const processedSessions = sessions.map((session) => ({
      ...session,
      dateValue: session.dateValue,
      startTime: session.startTime,
      endTime: session.endTime,
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
        volunteerIds: invitedVolunteerIds,
      },
    };
    console.log({ payload });
    const response = await axios.put(`/activity/${activivtyId}`, payload);
    console.log(response);

    if (response.status === 200) {
      navigate("/activity-management");
    }
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

  useEffect(() => {
    const enrichedData = activityData?.Volunteers?.map((volunteer: any) => ({
      volunteerId: volunteer?.volunteerId,
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

    const handledRows = enrichedData.filter(
      (vol: { active_status: string }) => vol.active_status === "active"
    );
    setRows(handledRows);
    setFilteredRows(handledRows);
    setIsLoading(false);
  }, [
    activityData,
    activityData.Volunteers,
    activityType,
    getEligible,
    navigate,
    setFilteredRows,
    setInvitedVolunteerIds,
  ]);

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
      {
        field: "actions",
        headerName: t("actions"),
        type: "actions",
        minWidth: 200,
        getActions: ({ id }: any) => {
          // console.log(id);
          return [
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              disabled={rows.length === 1}
              onClick={() => {
                setRows((prev: any[]) =>
                  prev.filter((row) => row?.volunteerId !== id)
                );
              }}
            />,
          ].filter(Boolean);
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
      rows.length,
      setFilterVisibility,
      sortModel,
      t,
    ]
  );

  useEffect(() => {
    const volunteerIds = rows?.map((item: any) => item?.volunteerId);
    setInvitedVolunteerIds(volunteerIds);
  }, [rows, setInvitedVolunteerIds]);

  const handleOnSave = useCallback(
    (value: any) => {
      console.log({ value });
      console.log({ newRows: [...rows, ...value] });

      setRows([...rows, ...value]);
    },
    [rows]
  );
  console.log("sessions in invited volunteer is", sessions);
  console.log("department is");

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsIds, setSelectedRowsIds] = useState<any[]>([]);
  const handleSelectionChange = (newSelection: any[]) => {
    const newSelectedRows: any = newSelection.map((selected) => {
      return rows.find((row: any) => row?.volunteerId === selected);
    });
    setSelectedRowsIds(newSelection);
    setSelectedRows(newSelectedRows);
  };

  // useEffect(() => console.log(selectedRows), [selectedRows]);
  // useEffect(() => console.log(columnVisibilityModel), [columnVisibilityModel]);

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
            Activity Module: {activityType.name}
          </Typography>
          <Typography variant="body1">Sessions: {sessions.length}</Typography>
          <Typography variant="body1">Start Date: {startDate}</Typography> */}
          {/* <Button variant="contained" sx={{ width: 200 }}>
            Invite New Volunteers
          </Button> */}
          <Paper sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              getRowId={(row) => row?.volunteerId} // Ensure the correct row ID is used
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
                    navigateTo={"/volunteer-information"}
                    mode={"inviteMore"}
                    setGetEligible={setGetEligible}
                    getEligible={getEligible}
                    onSave={(value: any) => handleOnSave(value)}
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
                <SaveIcon fontSize="small" /> {t("save changes")}
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
                <SaveIcon fontSize="small" /> {t("save changes")}
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default InvitedVolunteer;

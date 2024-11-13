// VolunteerPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {Button, Box, Typography, CircularProgress, TextField } from "@mui/material";
import axios from "../utils/axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import FilterHeader from "./FilterHeader";
import AlertNotification from "./AlertNotification";
import DateFilterHeader from "./DateFilterHeader";
import CustomDateRenderer from "./CustomDateRenderer";
import QAFilterHeader from "./QAFilterHeader";
import GenderFilterHeader from "./GenderFilterHeader";
import GridCustomToolbar from "./GridCustomToolbar";
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import { useTranslation } from "react-i18next";
import Address from "./Address";
import DownloadButton from "./DownloadButton";

export default function VolunteerPage() {
  // const location = useLocation();
  // const { title, department, activityType, sessions } = location.state;
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const { t } = useTranslation();
  const paginationModel = { page: 0, pageSize: 5 };
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState(location.state?.title || "");
  const [department, setDepartment] = useState(location.state?.department || "");
  const [activityType, setActivityType] = useState(location.state?.activityType || "");
  const [numSessions, setNumSessions] = useState(location.state?.numSessions || 1);
  const [minSessions, setminSessions] = useState(location.state?.minSessions || 1);
  const [sessions, setSessions] = useState(location.state?.sessions || []);
  const [startDate , setStartDate] = useState(location.state.startDate || null) ; 
  console.log("information from the previous page is" , location.state);
  

  const handleNext = () => {
    navigate("/another-page", {
      state: { 
        title,
        department,
        activityType,
        numSessions,
        sessions,
        minSessions,
        startDate,

      }
    });
  };

  const handleBack = () => {
    navigate("/activity-summary", {
      state: {
        title,
        department,
        activityType,
        numSessions,
        sessions,
        minSessions,
        startDate,
      },
    });
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
        const response = await axios.get("/volunteer");
        console.log("response is", response.data);
        if (response && response.status === 200) {
          const enrichedData = response.data.map((volunteer: any) => ({
            volunteerId: volunteer.volunteerId,
            active_status: volunteer.active_status,
            ...(volunteer.Person || {}),
            address: `${
              volunteer?.Person?.Address?.state?.split("/")[1] || ""
            } - ${volunteer?.Person?.Address?.city?.split("/")[1] || ""} - ${
              volunteer?.Person?.Address?.district?.split("/")[1] || ""
            } - ${volunteer?.Person?.Address?.village?.split("/")[1] || ""}`,

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
  }, []);
  console.log("the rows is ", rows);

  // Memoized columns definition to prevent re-rendering
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "volunteerId",
        headerName: t("id"),
        minWidth: 100,
        sortable: true,
        editable: false,
      },
      {
        field: "fname",
        headerName: t("fname"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
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
        editable: true,
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
        editable: true,
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
        editable: true,
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
        editable: true,
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
        editable: true,
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
        editable: true,
        renderCell: (params) => <CustomDateRenderer value={params.value} />,
        renderEditCell: (_params) => (
          <TextField
            type="date"
            // value={newBdate}
            // onChange={(e: any) => setNewBdate(e.target.value)}
            fullWidth
          />
        ),
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
        editable: true,
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
        editable: true,
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
        editable: true,
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
        field: "address",
        headerName: t("address"),
        minWidth: 300,
        sortable: false,
        hideSortIcons: true,
        editable: true,
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
        renderEditCell: (_params) => <Address setAddressId={setAddressId} />,
      },

      {
        field: "nationalNumber",
        headerName: t("nationalNumber"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
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
        editable: true,
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
        field: "smoking",
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        headerName: t("smoking"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
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
        editable: true,
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
        editable: true,
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
        editable: true,
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
      { field: "note", headerName: t("note"), width: 200, editable: true },
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
        // editable: true,
        // renderEditCell: (params) => {
        //   // console.log(params.row);
        //   return (
        //     <FileUpload
        //       fileId={params.row.fileId as number}
        //       setFileId={setFileId}
        //       setUpdatedFile={setUpdatedFile}
        //       mode={"edit"}
        //       setUploadFileSizeError={setUploadFileSizeError}
        //     />
        //   );
        // },
      },
    ],
    [  clearFilter,
      filterModel,
      filterVisibility,
      // newBdate,
      // handleCancel,
      handleDateFilterChange,
      // handleEditClick,
      // handleOpenDeleteDialog,
      // handleOpenPromoteDialog,
      // handleSave,
      handleSortClick,
      handleTextFilterChange,
      // handleToggleActive,
      // rowModesModel,
      rows,
      setFilterVisibility,
      sortModel,
      t,]
  );
  const handleSelectionChange = (newSelection: any[]) => {
    const newSelectedRows: any = newSelection.map((selected) => {
      return filteredRows.find((row) => row.id === selected);
    });
    setSelectedRows(newSelectedRows);}



  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Volunteer Information</Typography>
      <Typography variant="body1">Activity Title: {title}</Typography>
      <Typography variant="body1">Department: {department.name}</Typography>
      <Typography variant="body1">Activity Type: {activityType.name}</Typography>
      <Typography variant="body1">Sessions: {sessions.length}</Typography>
      <Typography variant="body1">Start Date: {startDate}</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
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
                rows={selectedRows}
                navigateTo={"/volunteer-information"}
              />
            ),
          }}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection // Enable checkboxes for row selection
          onRowSelectionModelChange={(newSelection: any) =>
            handleSelectionChange(newSelection)
          }
          disableRowSelectionOnClick
        />
      )}

<Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={handleBack}>
        Back to Activity Summary
      </Button>
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleNext}>
        Next
      </Button>
    </Box>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { Loading } from "./Loading";
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import { useTranslation } from "react-i18next";
import FilterHeader from "./FilterHeader";
import FilterBooleanHeader from "./FilterBooleanHeader";
import GridCustomToolbar from "./GridCustomToolbar";
const Activity = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    filteredRows,
    sortModel,
    filterModel,
    filterVisibility,
    setFilteredRows,
    setFilterVisibility,
    handleTextFilterChange,
    clearFilter,
    clearAllFilters,
    handleSortClick,
  } = useGridFilterSort({
    initialFilterModel: {
      title: "",
      done: false,
    },
    initialFilterVisibility: {
      title: false,
      done: false,
    },
    rows, // your initial rows data
  });

  const paginationModel = { page: 0, pageSize: 5 };
  const columns: GridColDef[] = [
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
      renderCell: (params) => (params?.value === true ? "Done" : "Not Done"),
    },
    {
      field: "actions",
      headerName: t("actions"),
      type: "actions",
      minWidth: 200,
      getActions: ({ id }: any) => {
        console.log(id);
        return [
          <GridActionsCellItem
            icon={<PlayArrowIcon />}
            label="Execute"
            onClick={() => navigate("/execute-activity", { state: { id } })}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => navigate("/activity-summary", { state: { id } })}
          />,
        ].filter(Boolean);
      },
    },
  ];

  useEffect(() => {
    async function fetchActivityData() {
      const Activitys = axios
        .get("activity")
        .then((res) => {
          console.log(res.data);
          const ActivityRows = res.data.map((activity: any) => {
            return {
              id: activity?.id,
              done: activity?.done,
              title: activity?.title,
            };
          });
          setLoading(false);
          setRows(ActivityRows);
          setFilteredRows(ActivityRows);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        });
      return Activitys;
    }

    const Activitys = fetchActivityData();
    console.log(Activitys);
  }, [setFilteredRows]);
  console.log("rows is ", rows);

  // useEffect(() => {
  //     async function fetchUserData() {
  //       const userData = await axios
  //         .get("/users")
  //         .then((res) => {
  //           const userRows = res.data.map((user: any) => {
  //             return {
  //               id: user?.userId,
  //               firstName: user?.Person?.fname,
  //               middleName: user?.Person?.mname,
  //               lastName: user?.Person?.lname,
  //               email: user?.Person?.email,
  //               phone: user?.Person?.phone,
  //               position: user?.position,
  //               study: user?.Person?.study,
  //               work: user?.Person?.work,
  //               gender: user?.Person?.gender,
  //               birthDate: user?.Person?.bDate,
  //               roleName: user?.Role?.name,
  //               roleDescription: user?.Role?.description,
  //               departmentName: user?.Department?.name,
  //               departmentDescription: user?.Department?.description,
  //             };
  //           });
  //           setLoading(false);
  //           setRows(userRows);
  //         })
  //         .catch((err) => {
  //           console.error(err);
  //           setError(err);
  //         });
  //       return userData;
  //     }

  //     const users = fetchUserData();
  //     console.log(users);
  //   }, []);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (newSelection: any[]) => {
    const newSelectedRows: any = newSelection.map((selected) => {
      return filteredRows.find((row) => row.id === selected);
    });
    setSelectedRows(newSelectedRows);
  };

  useEffect(() => console.log(selectedRows), [selectedRows]);
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
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            getRowId={(row) => row.id} // Ensure the correct row ID is used
            disableColumnFilter
            disableColumnMenu
            slots={{
              toolbar: () => (
                <GridCustomToolbar
                  clearAllFilters={clearAllFilters}
                  rows={selectedRows}
                  navigateTo={"/volunteer-information"}
                  mode="addActivity"
                />
              ),
            }}
            editMode="row"
            localeText={{
              toolbarColumns: t("columns"),
              toolbarDensity: t("density"),
            }}
            checkboxSelection // Enable checkboxes for row selection
            onRowSelectionModelChange={(newSelection: any) =>
              handleSelectionChange(newSelection)
            }
            disableRowSelectionOnClick
          />
        </Paper>
      )}
    </>
  );
};

export default Activity;

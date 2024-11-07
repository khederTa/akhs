/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DataGrid,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridRenderEditCellParams,
  GridRenderCellParams,
  GridToolbarContainerProps,
  useGridRootProps,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Button,
  Stack,
  Chip,
  Box,
  Autocomplete,
  TextField,
  Switch,
  debounce,
} from "@mui/material";
import axios from "../utils/axios";
import { Loading } from "./Loading";
import { ReportModal } from "./ReportModal";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import FilterHeader from "./FilterHeader";
import { useTranslation } from "react-i18next";
import AlertNotification from "./AlertNotification";
const paginationModel = { page: 0, pageSize: 5 };

const AntSwitch = styled(Switch)(({ theme }: any) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#1890ff",
        ...theme.applyStyles("dark", {
          backgroundColor: "#177ddc",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "rgba(0,0,0,.25)",
    boxSizing: "border-box",
    ...theme.applyStyles("dark", {
      backgroundColor: "rgba(255,255,255,.35)",
    }),
  },
}));

export function ActivityTypes() {
  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  const [departments, setDepartments] = useState<any[]>([]);
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const apiRef = useGridApiRef();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [, setIsClient] = useState(false); // Add client-side rendering check
  const [filterModel, setFilterModel] = useState<{ [key: string]: string }>({
    name: "",
    department: "",
    description: "",
  });

  const [filterVisibility, setFilterVisibility] = useState<{
    [key: string]: boolean;
  }>({
    name: false,
    department: false,
    description: false,
  });
  const [sortModel, setSortModel] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({ field: "", direction: "asc" });

  // Set client-only rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditClick = useCallback(
    (id: any) => {
      setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "edit" } }));
      apiRef.current.setCellFocus(id, "name"); // Focus on the row's 'name' cell
    },
    [apiRef]
  );

  const handleSave = useCallback(async (id: any) => {
    setAction("save");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  }, []);

  const handleCancel = useCallback((id: any) => {
    setAction("cancel");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  }, []);

  useEffect(() => {
    const fetchActivityTypes = async () => {
      setIsLoading(true);
      try {
        const { data, status } = await axios.get("/activityType");
        if (status === 200) {
          const adjustedData = data.map((activityType: any) => ({
            ...activityType,
            prerequisites: activityType.Prerequisites,
            department: activityType.Department?.name,
          }));
          setRows(adjustedData);
          setFilteredRows(adjustedData);
        } else {
          console.error("Unexpected response:", status);
        }
      } catch (error) {
        console.error("Error fetching activity types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get("/department");
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchActivityTypes();
    fetchDepartments();
  }, []);

  // Create the debounced filter function with useMemo to avoid recreating it on each render
  const debouncedFilter = useMemo(
    () =>
      debounce((filterModel: { [key: string]: string }) => {
        const filtered = rows.filter((row) => {
          return Object.entries(filterModel).every(([field, value]) => {
            // Only apply filtering if a filter value exists
            if (value) {
              // Convert both row value and filter value to lowercase to make it case-insensitive
              const cellValue = row[field]?.toString().toLowerCase() || "";
              const filterValue = value.toLowerCase();

              // Check if the entire filter string is included in the cell value
              return cellValue.includes(filterValue);
            }
            return true; // If no filter value, consider it a match for that field
          });
        });
        setFilteredRows(filtered as any);
      }, 300),
    [rows] // Only re-create if `rows` changes
  );

  // Memoize the function that triggers debounced filtering
  const updateFilteredRows = useCallback(
    (filterModel: { [key: string]: string }) => {
      debouncedFilter(filterModel);
    },
    [debouncedFilter]
  );

  const handleFilterChange = useCallback(
    (field: string, value: string) => {
      if (filterModel[field] === value) return;
      const newFilterModel = { ...filterModel, [field]: value };
      setFilterModel(newFilterModel);
      updateFilteredRows(newFilterModel);
    },
    [filterModel, updateFilteredRows]
  );

  const clearFilter = useCallback(
    (field: string) => {
      handleFilterChange(field, "");
    },
    [handleFilterChange]
  );

  const handleSortClick = useCallback(
    (field: string) => {
      const isAsc = sortModel.field === field && sortModel.direction === "asc";
      const direction = isAsc ? "desc" : "asc";
      setSortModel({ field, direction });

      const sortedRows = [...filteredRows].sort((a, b) => {
        if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
        if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setFilteredRows(sortedRows);
    },
    [filteredRows, sortModel.direction, sortModel.field]
  );

  // active / inactive an activity type
  const handleToggleActive = useCallback(
    async (id: number) => {
      const rowIndex = rows.findIndex((row) => row.id === id);
      if (rowIndex === -1) return;

      // Toggle active_status
      const updatedActiveStatus =
        rows[rowIndex].active_status === "active" ? "inactive" : "active";
      const updatedRow = {
        ...rows[rowIndex],
        active_status: updatedActiveStatus,
      };
      const updatedRowToPut = {
        ...rows[rowIndex],
        prerequisites: rows[rowIndex].prerequisites.map((pre: any) => pre.id),
        active_status: updatedActiveStatus,
      };
      console.log(updatedRow);
      try {
        // Update the backend
        await axios.put(`/activityType/${id}`, updatedRowToPut);

        // Update the rows state
        const updatedRows = [...rows];
        updatedRows[rowIndex] = updatedRow;
        setRows(updatedRows);

        // Update filteredRows if it includes the row
        const filteredRowIndex = filteredRows.findIndex(
          (row: any) => row.id === id
        );
        if (filteredRowIndex !== -1) {
          const updatedFilteredRows = [...filteredRows];
          updatedFilteredRows[filteredRowIndex] = updatedRow as never;
          setFilteredRows(updatedFilteredRows);
        }
      } catch (error) {
        console.error("Error updating active status:", error);
      }
    },
    [filteredRows, rows]
  );

  const DepartmentEditor = memo((params: GridRenderEditCellParams) => {
    const handleChange = (_event: any, newValue: any) => {
      console.log(newValue);
      params.api.setEditCellValue({
        id: params.row.id,
        field: "department",
        value: newValue?.name || "",
      });
    };

    return (
      <Autocomplete
        id="department-editor"
        sx={{ width: "100%" }}
        options={departments}
        getOptionLabel={(option: { name: any }) => option.name}
        value={departments.find((dep) => dep.name === params.value) || null}
        onChange={handleChange}
        renderInput={(params: any) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Select Department"
          />
        )}
      />
    );
  });
  // Custom cell editor component for prerequisites column using Autocomplete
  const PrerequisiteEditor = memo((params: GridRenderEditCellParams) => {
    const [selectedPrerequisites, setSelectedPrerequisites] = useState<any[]>(
      params.value || []
    );

    // Filter out the current activity itself from the available options
    const availablePrerequisites = rows.filter(
      (activity) =>
        activity.id !== params.row.id && activity.active_status === "active"
    );

    const handleChange = (_event: any, newValue: any[]) => {
      setSelectedPrerequisites(newValue);
      params.api.setEditCellValue({
        id: params.row.id,
        field: "prerequisites",
        value: newValue,
      });
    };

    return (
      <Autocomplete
        multiple
        id="tags-filled"
        sx={{
          width: "100%",
        }}
        options={availablePrerequisites}
        getOptionLabel={(option: { name: any }) => option.name}
        value={selectedPrerequisites}
        onChange={handleChange}
        isOptionEqualToValue={(option: any, value: any) =>
          option.id === value.id
        }
        renderInput={(params: any) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Select prerequisites"
            sx={{
              minHeight: "53px !important",
            }}
          />
        )}
        renderTags={(
          value: any[],
          getTagProps: (arg0: { index: number }) => any
        ) =>
          value.map((option: any, index: number) => (
            <Chip label={option.name} {...getTagProps({ index })} />
          ))
        }
      />
    );
  });

  // Custom renderer for displaying prerequisites as chips
  const PrerequisiteRenderer = memo((params: GridRenderCellParams) => {
    const selectedPrerequisites = params.value || [];
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          height: "100%",
          alignItems: "center",
        }}
      >
        {selectedPrerequisites.map((prerequisite: any) => (
          <Chip key={prerequisite.id} label={prerequisite.name} size="small" />
        ))}
      </Box>
    );
  });

  const columns: any[] = useMemo(
    () => [
      {
        field: "id",
        headerName: t("id"),
        minWidth: 150,
        sortable: true,
        // hideSortIcons: true,
        editable: false,
      },
      {
        field: "name",
        headerName: t("name"),
        minWidth: 250,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"name"}
            field={"name"}
            filterModel={filterModel}
            sortModel={sortModel}
            filterVisibility={filterVisibility}
            handleSortClick={handleSortClick}
            handleFilterChange={handleFilterChange}
            setFilterVisibility={setFilterVisibility}
            clearFilter={clearFilter}
          />
        ),
      },
      {
        field: "prerequisites",
        headerName: t("prerequisites"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true, // Enable editing for this column
        renderEditCell: (params: any) => <PrerequisiteEditor {...params} />, // Custom editor
        renderCell: (params: any) => <PrerequisiteRenderer {...params} />, // Custom renderer for display
      },
      {
        field: "department",
        headerName: t("department"),
        minWidth: 300,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderEditCell: (params: any) => <DepartmentEditor {...params} />,
        renderHeader: () => (
          <FilterHeader
            key={"department"}
            field={"department"}
            filterModel={filterModel}
            sortModel={sortModel}
            filterVisibility={filterVisibility}
            handleSortClick={handleSortClick}
            handleFilterChange={handleFilterChange}
            setFilterVisibility={setFilterVisibility}
            clearFilter={clearFilter}
          />
        ),
      },
      {
        field: "description",
        headerName: t("description"),
        minWidth: 300,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"description"}
            field={"description"}
            filterModel={filterModel}
            sortModel={sortModel}
            filterVisibility={filterVisibility}
            handleSortClick={handleSortClick}
            handleFilterChange={handleFilterChange}
            setFilterVisibility={setFilterVisibility}
            clearFilter={clearFilter}
          />
        ),
      },
      // {
      //   field: "active_status",
      //   headerName: "Active / Inactive",
      //   minWidth: 150,
      //   renderCell: (params: any) => (
      //     <Stack
      //       spacing={1}
      //       sx={{
      //         display: "flex",
      //         height: "100%",
      //         justifyContent: "center",
      //       }}
      //     >
      //       <AntSwitch
      //         defaultChecked={params.value === "active"}
      //         inputProps={{ "aria-label": "ant design" }}
      //         onChange={() => handleToggleActive(params.row)}
      //       />
      //     </Stack>
      //   ),
      // },
      {
        field: "actions",
        headerName: t("actions"),
        type: "actions",
        width: 150,
        getActions: (params: any) => {
          const isInEditMode = rowModesModel[params.id]?.mode === "edit";

          return [
            !isInEditMode && (
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                onClick={() => handleEditClick(params.id)}
                key="edit"
              />
            ),
            !isInEditMode && (
              <Stack
                spacing={1}
                sx={{
                  display: "flex",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <AntSwitch
                  defaultChecked={
                    rows.find((row) => row.id === params.id).active_status ===
                    "active"
                  }
                  inputProps={{ "aria-label": "ant design" }}
                  onChange={() => handleToggleActive(params.id)}
                />
              </Stack>
            ),
            isInEditMode && (
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                onClick={() => {
                  handleSave(params.id);
                }}
                key="save"
              />
            ),
            isInEditMode && (
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                onClick={() => handleCancel(params.id)}
                key="cancel"
              />
            ),
          ].filter(Boolean) as React.ReactElement[]; // Ensure only elements remain in the array
        },
      },
    ],
    [
      DepartmentEditor,
      PrerequisiteEditor,
      PrerequisiteRenderer,
      clearFilter,
      filterModel,
      filterVisibility,
      handleCancel,
      handleEditClick,
      handleFilterChange,
      handleSave,
      handleSortClick,
      handleToggleActive,
      rowModesModel,
      rows,
      sortModel,
      t,
    ]
  );
  // const CustomToolbar = memo(() => (
  //   <GridToolbarContainer>
  //     <>
  //       <Button type="button" onClick={() => navigate("/new-activity-type")}>
  //         <AddOutlinedIcon />
  //         Add
  //       </Button>
  //     </>
  //     <GridToolbarColumnsButton />
  //     <GridToolbarDensitySelector slotProps={{ button: { text: 'Change density' } }} />
  //     <>
  //       <Button onClick={() => setReportModalIsOpen(true)}>
  //         <FileDownloadOutlinedIcon />
  //         Export
  //       </Button>
  //     </>
  //   </GridToolbarContainer>
  // ));

  const GridCustomToolbar = forwardRef<
    HTMLDivElement,
    GridToolbarContainerProps
  >(function GridToolbar(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();

    return (
      <GridToolbarContainer>
        <>
          <Button type="button" onClick={() => navigate("/new-activity-type")}>
            <AddOutlinedIcon />
            {t("add")}
          </Button>
        </>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <>
          <Button onClick={() => setReportModalIsOpen(true)}>
            <FileDownloadOutlinedIcon />
            {t("export")}
          </Button>
        </>
      </GridToolbarContainer>
    );
  });
  const processRowUpdate = useCallback(
    async (newRow: any) => {
      if (action === "save") {
        try {
          const departmentId = departments.filter(
            (department) => department.name === newRow.department
          )[0].id;
          console.log(newRow);
          const updatedRow = {
            ...newRow,
            prerequisites: newRow.prerequisites,
            departmentId,
          };
          const updatedRowToPost = {
            ...newRow,
            prerequisites: newRow.prerequisites.map((pre: any) => pre.id), // Convert prerequisites to IDs
            departmentId,
          };

          const response = await axios.put(
            `/activityType/${newRow.id}`,
            updatedRowToPost
          );
          if (response.status === 200) {
            setAlertMessage("activity type updated successfully");
            setAlertSeverity("success");
            console.log("Row updated successfully:", newRow);
            setRows((prevRows: any) =>
              prevRows.map((row: any) =>
                row.id === newRow.id ? updatedRow : row
              )
            );
            return updatedRow;
          } else {
            setAlertMessage("failed to update activity type");
            setAlertSeverity("error");
          }
        } catch (error) {
          console.error("Error updating row:", error);
          setAlertMessage("failed to update activity type");
          setAlertSeverity("error");
        } finally {
          setAlertOpen(true);
        }
      } else if (action === "cancel") {
        const oldRow = rows.find((row) => row.id === newRow.id);
        // setRows((prevRows: any) =>
        //   prevRows.map((row: any) => (row.id === newRow.id ? oldRow : row))
        // );
        return oldRow;
      }
    },
    [action, departments, rows]
  );

  return (
    <>
      <ReportModal
        open={reportModalIsOpen}
        handleClose={() => setReportModalIsOpen(false)}
        setReportName={setReportName}
        reportName={reportName}
        rows={rows}
      />
      <AlertNotification
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleAlertClose}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <Paper sx={{ height: 400, width: "100%" }}>
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
            slots={{ toolbar: GridCustomToolbar }}
            editMode="row"
            localeText={{
              toolbarColumns: t("columns"),
              toolbarDensity: t("density"),
            }}
            rowModesModel={rowModesModel}
            processRowUpdate={processRowUpdate}
            apiRef={apiRef}
          />
        </Paper>
      )}
    </>
  );
}

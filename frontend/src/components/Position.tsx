/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, debounce, Paper } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
  GridToolbarContainerProps,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  useGridRootProps,
} from "@mui/x-data-grid";
import { Loading } from "./Loading";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import axios from "../utils/axios";
import DraggableDialog from "./DraggableDialog"; // Import the dialog component
import { useTranslation } from "react-i18next";
import FilterHeader from "./FilterHeader";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { ReportModal } from "./ReportModal";
import AlertNotification from "./AlertNotification";
const Position = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [oldRow, setOldRow] = useState({});
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const navigate = useNavigate();
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
  const apiRef = useGridApiRef();
  const paginationModel = { page: 0, pageSize: 5 };
  const { t } = useTranslation();
  const [filteredRows, setFilteredRows] = useState([]);
  const [, setIsClient] = useState(false); // Add client-side rendering check
  const [filterModel, setFilterModel] = useState<{ [key: string]: string }>({
    name: "",
    description: "",
  });

  const [filterVisibility, setFilterVisibility] = useState<{
    [key: string]: boolean;
  }>({
    name: false,
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

  const handleEditClick = useCallback(
    (id: any) => {
      const currentRow = rows.find((row: any) => row.id === id);
      setOldRow(currentRow as any);
      setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "edit" } }));
      apiRef.current.setCellFocus(id, "name");
    },
    [apiRef, rows]
  );
  const handleSave = useCallback(async (id: any) => {
    setAction("save");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  }, []);

  const handleCancel = useCallback((id: any) => {
    setAction("cancel");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  }, []);

  const handleOpenDeleteDialog = useCallback((id: any) => {
    setRowToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: t("id"), width: 200 },
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
      {
        field: "actions",
        headerName: t("actions"),
        type: "actions",
        width: 150,
        getActions: (params) => {
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
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleOpenDeleteDialog(params.id)}
                key="delete"
              />
            ),
            isInEditMode && (
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                onClick={() => handleSave(params.id)}
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
          ].filter(Boolean) as React.ReactElement[];
        },
      },
    ],
    [
      clearFilter,
      filterModel,
      filterVisibility,
      handleCancel,
      handleEditClick,
      handleFilterChange,
      handleOpenDeleteDialog,
      handleSave,
      handleSortClick,
      rowModesModel,
      sortModel,
      t,
    ]
  );

  useEffect(() => {
    async function fetchPositions() {
      setIsLoading(true);
      try {
        const response = await axios.get("/position");
        if (response && response.status === 200) {
          setRows(response.data);
          setFilteredRows(response.data);
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPositions();
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setRowToDelete(null);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      const response = await axios.delete(`/position/${rowToDelete}`);
      if (response.status) {
        setAlertMessage("position deleted successfully");
        setAlertSeverity("success");
        setRows((prevRows) =>
          prevRows.filter((row: any) => row.id !== rowToDelete)
        );
        setFilteredRows((prevRows) =>
          prevRows.filter((row: any) => row.id !== rowToDelete)
        );
        handleCloseDeleteDialog();
      } else {
        setAlertMessage("failed to delete position");
        setAlertSeverity("error");
      }
    } catch (error) {
      setAlertMessage("failed to delete position");
      setAlertSeverity("error");
      console.error("Error deleting position:", error);
    } finally {
      setAlertOpen(true);
    }
  }, [handleCloseDeleteDialog, rowToDelete]);

  const processRowUpdate = useCallback(
    async (updatedRow: any) => {
      if (action === "save") {
        try {
          const response = await axios.put(
            `/position/${updatedRow.id}`,
            updatedRow
          );
          if (response.status === 200) {
            setAlertMessage("position updated successfully");
            setAlertSeverity("success");
            setRows((prevRows: any) =>
              prevRows.map((row: any) =>
                row.id === updatedRow.id ? updatedRow : row
              )
            );
            setFilteredRows((prevRows: any) =>
              prevRows.map((row: any) =>
                row.id === updatedRow.id ? updatedRow : row
              )
            );
            return updatedRow;
          } else {
            setAlertMessage("failed to update position");
            setAlertSeverity("error");
          }
        } catch (error) {
          console.error("Error updating row:", error);
          setAlertMessage("failed to update position");
          setAlertSeverity("error");
        } finally {
          setAlertOpen(true);
        }
      } else if (action === "cancel") {
        // setRows((prevRows: any) =>
        //   prevRows.map((row: any) => (row.id === updatedRow.id ? oldRow : row))
        // );
        return oldRow;
      }
    },
    [action, oldRow]
  );

  const GridCustomToolbar = forwardRef<
    HTMLDivElement,
    GridToolbarContainerProps
  >(function GridToolbar(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();

    return (
      <GridToolbarContainer>
        <>
          <Button type="button" onClick={() => navigate("/new-position")}>
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
        <div>
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              sx={{ border: 0 }}
              editMode="row"
              rowModesModel={rowModesModel}
              disableColumnFilter
              disableColumnMenu
              slots={{ toolbar: GridCustomToolbar }}
              localeText={{
                toolbarColumns: t("columns"),
                toolbarDensity: t("density"),
              }}
              processRowUpdate={processRowUpdate}
              apiRef={apiRef}
            />
          </Paper>

          {/* Delete Confirmation Dialog */}
          <DraggableDialog
            open={isDeleteDialogOpen}
            handleClose={handleCloseDeleteDialog}
            onConfirm={handleDelete}
          />
        </div>
      )}
    </>
  );
};

export default Position;

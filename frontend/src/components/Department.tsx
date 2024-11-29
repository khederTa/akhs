/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paper, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Loading } from "./Loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import axios from "../utils/axios";
import DraggableDialog from "./DraggableDialog"; // Import the dialog component
import FilterHeader from "./FilterHeader";
import { useTranslation } from "react-i18next";
import AlertNotification from "./AlertNotification";
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import GridCustomToolbar from "./GridCustomToolbar";
const Department = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [oldRow, setOldRow] = useState({});
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);

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
      name: "",
      description: "",
    },
    initialFilterVisibility: {
      name: false,
      description: false,
    },
    rows, // your initial rows data
  });

  const handleEditClick = useCallback(
    (id: any) => {
      const currentRow = rows.find((row: any) => row.id === id);
      setOldRow(currentRow as any);
      setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "edit" } }));
      apiRef.current.setCellFocus(id, "name"); // Focus on the row's 'name' cell
    },
    [apiRef, rows]
  );

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
            handleFilterChange={handleTextFilterChange}
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
            handleFilterChange={handleTextFilterChange}
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
              <Tooltip title={t("edit")}>
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  onClick={() => handleEditClick(params.id)}
                  key="edit"
                />
              </Tooltip>
            ),
            // !isInEditMode && (
            //   <GridActionsCellItem
            //     icon={<DeleteIcon />}
            //     label="Delete"
            //     onClick={() => handleOpenDeleteDialog(params.id)}
            //     key="delete"
            //   />
            // ),
            isInEditMode && (
              <Tooltip title={t("save")}>
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label="Save"
                  onClick={() => {
                    console.log("Saving...");
                    handleSave(params.id);
                  }}
                  key="save"
                />
              </Tooltip>
            ),
            isInEditMode && (
              <Tooltip title={t("cancel")}>
                <GridActionsCellItem
                  icon={<CancelIcon />}
                  label="Cancel"
                  onClick={() => handleCancel(params.id)}
                  key="cancel"
                />
              </Tooltip>
            ),
          ].filter(Boolean) as React.ReactElement[]; // Ensure only elements remain in the array
        },
      },
    ],
    [
      clearFilter,
      filterModel,
      filterVisibility,
      handleEditClick,
      handleSortClick,
      handleTextFilterChange,
      rowModesModel,
      setFilterVisibility,
      sortModel,
      t,
    ]
  );

  useEffect(() => {
    async function fetchDepartment() {
      setIsLoading(true);
      try {
        const response = await axios.get("department");
        if (response && response.status === 200) {
          setRows(response.data);
          setFilteredRows(response.data);
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Error fetching Department:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDepartment();
  }, [setFilteredRows]);

  const handleSave = async (id: any) => {
    setAction("save");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  };

  const handleCancel = (id: any) => {
    setAction("cancel");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  };

  // const handleOpenDeleteDialog = (id: any) => {
  //   setRowToDelete(id); // Set the ID of the row to delete
  //   setIsDeleteDialogOpen(true); // Open the delete dialog
  // };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`department/${rowToDelete}`);
      if (response.status === 200) {
        setAlertMessage("department deleted successfully");
        setAlertSeverity("success");
        setRows((prevRows) =>
          prevRows.filter((row: any) => row.id !== rowToDelete)
        );
        setFilteredRows((prevRows) =>
          prevRows.filter((row: any) => row.id !== rowToDelete)
        );
        handleCloseDeleteDialog();
      } else {
        setAlertMessage("failed to delete department");
        setAlertSeverity("error");
      }
    } catch (error) {
      setAlertMessage("failed to delete department");
      setAlertSeverity("error");
      console.error("Error deleting department:", error);
    } finally {
      setAlertOpen(true);
    }
  };

  const processRowUpdate = async (updatedRow: any) => {
    if (action === "save") {
      try {
        const response = await axios.put(
          `department/${updatedRow.id}`,
          updatedRow
        );
        if (response.status === 200) {
          setAlertMessage("department updated successfully");
          setAlertSeverity("success");
          setRows((prevRows: any) =>
            prevRows.map((row: any) =>
              row.id === updatedRow.id ? updatedRow : row
            )
          );
          return updatedRow; // Return the updated row
        } else {
          setAlertMessage("failed to update department");
          setAlertSeverity("error");
        }
      } catch (error) {
        console.error("Error updating row:", error);
        setAlertMessage("failed to update department");
        setAlertSeverity("error");
      } finally {
        setAlertOpen(true);
      }
    } else if (action === "cancel") {
      setRows((prevRows: any) =>
        prevRows.map((row: any) => (row.id === updatedRow.id ? oldRow : row))
      );
      return oldRow;
    }
  };
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
  return (
    <>
      <AlertNotification
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleAlertClose}
      />
      {/* Delete Confirmation Dialog */}
      <DraggableDialog
        open={isDeleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
      />
      {isLoading ? (
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
                  rows={selectedRowsToExport}
                  navigateTo={"/new-department"}
                />
              ),
            }}
            editMode="row"
            localeText={{
              toolbarColumns: t("columns"),
              toolbarDensity: t("density"),
            }}
            rowModesModel={rowModesModel}
            processRowUpdate={processRowUpdate}
            apiRef={apiRef}
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

export default Department;

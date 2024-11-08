/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paper } from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import axios from "../utils/axios";
import { useTranslation } from "react-i18next";
import FilterHeader from "./FilterHeader";
import { ReportModal } from "./ReportModal";
import AlertNotification from "./AlertNotification";
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import GridCustomToolbar from "./GridCustomToolbar";
const Position = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [oldRow, setOldRow] = useState({});
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
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
        minWidth: 200,
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
        minWidth: 200,
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
      handleOpenDeleteDialog,
      handleSave,
      handleSortClick,
      handleTextFilterChange,
      rowModesModel,
      setFilterVisibility,
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
  }, [setFilteredRows]);

  // const handleCloseDeleteDialog = useCallback(() => {
  //   setIsDeleteDialogOpen(false);
  //   setRowToDelete(null);
  // }, []);

  // const handleDelete = useCallback(async () => {
  //   try {
  //     const response = await axios.delete(`/position/${rowToDelete}`);
  //     if (response.status) {
  //       setAlertMessage("position deleted successfully");
  //       setAlertSeverity("success");
  //       setRows((prevRows) =>
  //         prevRows.filter((row: any) => row.id !== rowToDelete)
  //       );
  //       setFilteredRows((prevRows) =>
  //         prevRows.filter((row: any) => row.id !== rowToDelete)
  //       );
  //       handleCloseDeleteDialog();
  //     } else {
  //       setAlertMessage("failed to delete position");
  //       setAlertSeverity("error");
  //     }
  //   } catch (error) {
  //     setAlertMessage("failed to delete position");
  //     setAlertSeverity("error");
  //     console.error("Error deleting position:", error);
  //   } finally {
  //     setAlertOpen(true);
  //   }
  // }, [handleCloseDeleteDialog, rowToDelete, setFilteredRows]);

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
    [action, oldRow, setFilteredRows]
  );

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
            slots={{
              toolbar: () => (
                <GridCustomToolbar
                  clearAllFilters={clearAllFilters}
                  rows={selectedRows}
                  navigateTo={"/new-position"}
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

export default Position;

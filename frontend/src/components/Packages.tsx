/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, Box, Chip, Paper, TextField } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Loading } from "./Loading";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import axios from "../utils/axios";
import DraggableDialog from "./DraggableDialog"; // Import the dialog component
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import { useTranslation } from "react-i18next";
import FilterHeader from "./FilterHeader";
import GridCustomToolbar from "./GridCustomToolbar";
import AlertNotification from "./AlertNotification";

export function Packages() {
  const [rows, setRows] = useState<any[]>([]);
  const [oldRow, setOldRow] = useState<any>({});
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const apiRef = useGridApiRef();
  const { t } = useTranslation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  const paginationModel = { page: 0, pageSize: 5 };
  const {
    filteredRows,
    sortModel,
    filterModel,
    filterVisibility,
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
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [packageResponse, activityTypeResponse] = await Promise.all([
          axios.get("/package"),
          axios.get("/activityType"),
        ]);

        if (packageResponse.status === 200) {
          const adjustedData = packageResponse.data.map((packageRow: any) => ({
            ...packageRow,
            activityTypes: packageRow.ActivityTypes,
          }));
          setRows(adjustedData);
          setPackages(adjustedData);
        } else {
          console.error("Unexpected package response:", packageResponse.status);
        }

        if (activityTypeResponse.status === 200) {
          setActivityTypes(() =>
            activityTypeResponse.data.filter(
              (item: { active_status: string }) =>
                item.active_status === "active"
            )
          );
        } else {
          console.error(
            "Unexpected activityType response:",
            activityTypeResponse.status
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const ActivityTypeEditor = (params: any) => {
    const [selectedActivityTypes, setSelectedActivityTypes] = useState<any[]>(
      params.value || []
    );

    const handleChange = (_event: any, newValue: any[]) => {
      setSelectedActivityTypes(newValue);
      try {
        params.api.setEditCellValue({
          id: params.row.id,
          field: "activityTypes",
          value: newValue,
        });
      } catch (error) {
        console.error("Error updating cell value:", error);
      }
    };

    return (
      <Autocomplete
        multiple
        id="tags-filled"
        sx={{ width: "100%" }}
        options={activityTypes}
        getOptionLabel={(option) => option.name}
        value={selectedActivityTypes}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Select activity type"
            sx={{ minHeight: "53px !important" }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option: any, index: number) => (
            <Chip label={option.name} {...getTagProps({ index })} />
          ))
        }
      />
    );
  };

  const ActivityTypeRenderer = (params: any) => {
    const selectedActivityTypes = params.value || [];
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
        {selectedActivityTypes.map((activityType: any) => (
          <Chip key={activityType.id} label={activityType.name} size="small" />
        ))}
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: t("id"),
      minWidth: 100,
      sortable: true,
      editable: false,
    },
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
      field: "activityTypes",
      headerName: t("activity types"),
      minWidth: 200,
      editable: true,
      sortable: false,
      hideSortIcons: true,
      renderEditCell: (params) => <ActivityTypeEditor {...params} />,
      renderCell: (params) => <ActivityTypeRenderer {...params} />,
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
  ];

  const handleEditClick = (id: any) => {
    const currentRow = rows.find((row: any) => row.id === id);
    setOldRow(currentRow as any);
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "edit" } }));
    apiRef.current.setCellFocus(id, "name");
  };

  const handleSave = async (id: any) => {
    setAction("save");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  };

  const handleCancel = (id: any) => {
    setAction("cancel");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  };

  const handleOpenDeleteDialog = (id: any) => {
    setRowToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/package/${rowToDelete}`);
      setRows((prevRows) =>
        prevRows.filter((row: any) => row.id !== rowToDelete)
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  const processRowUpdate = async (updatedRow: any) => {
    if (action === "save") {
      try {
        const payload = {
          id: updatedRow.id,
          name: updatedRow.name,
          description: updatedRow.description,
          activityTypeIds: updatedRow.activityTypes.map(
            (activityType: any) => activityType.id
          ),
        };
        const response = await axios.put(`/package/${updatedRow.id}`, payload);
        if (response.status === 200) {
          setRows((prevRows: any) =>
            prevRows.map((row: any) =>
              row.id === updatedRow.id ? updatedRow : row
            )
          );
          return updatedRow;
        } else {
          throw new Error("Failed to update row");
        }
      } catch (error) {
        console.error("Error updating row:", error);
        throw error;
      }
    } else if (action === "cancel") {
      setRows((prevRows: any) =>
        prevRows.map((row: any) => (row.id === updatedRow.id ? oldRow : row))
      );
      return oldRow;
    }
  };

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
                  rows={selectedRows}
                  navigateTo={"/new-package"}
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
}

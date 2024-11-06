import { Autocomplete, Box, Button, Chip, Paper, Stack, TextField } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Loading } from "./Loading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import axios from "../utils/axios";
import DraggableDialog from "./DraggableDialog"; // Import the dialog component

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
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const paginationModel = { page: 0, pageSize: 5 };

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
          setActivityTypes(activityTypeResponse.data);
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

    const handleChange = (event: any, newValue: any[]) => {
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
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Name", width: 200, editable: true },
    { field: "description", headerName: "Description", width: 200, editable: true },
    {
      field: "activityTypes",
      headerName: "Activity Types",
      minWidth: 200,
      editable: true,
      renderEditCell: (params) => <ActivityTypeEditor {...params} />,
      renderCell: (params) => <ActivityTypeRenderer {...params} />,
    },
    {
      field: "actions",
      headerName: "Actions",
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

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <Stack direction="row" justifyContent={"flex-start"} sx={{ gap: 1 }}>
        <Button
          type="button"
          variant="contained"
          onClick={() => navigate("/new-package")}
        >
          Create New Package
        </Button>
      </Stack>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
          editMode="row"
          rowModesModel={rowModesModel}
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
  );
}
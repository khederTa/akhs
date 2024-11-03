import { Button, Paper, Stack } from "@mui/material";
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

const Position = () => {
  const [rows, setRows] = useState([]);
  const [oldRow, setOldRow] = useState({});
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const paginationModel = { page: 0, pageSize: 5 };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Name", width: 200, editable: true },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      editable: true,
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

  useEffect(() => {
    async function fetchPositions() {
      setIsLoading(true);
      try {
        const response = await axios.get("/position");
        if (response && response.status === 200) {
          setRows(response.data);
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
      await axios.delete(`/position/${rowToDelete}`);
      setRows((prevRows) =>
        prevRows.filter((row: any) => row.id !== rowToDelete)
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting position:", error);
    }
  };

  const processRowUpdate = async (updatedRow: any) => {
    if (action === "save") {
      try {
        const response = await axios.put(
          `/position/${updatedRow.id}`,
          updatedRow
        );
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
      // setRows((prevRows: any) =>
      //   prevRows.map((row: any) => (row.id === updatedRow.id ? oldRow : row))
      // );
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
          onClick={() => navigate("/new-position")}
        >
          Add New Position
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
};

export default Position;

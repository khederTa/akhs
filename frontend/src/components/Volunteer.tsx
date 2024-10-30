import { Button, Paper, Stack } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Loading } from "./Loading";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import axios from "../utils/axios";
import DraggableDialog from "./DraggableDialog";

const Volunteer = () => {
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

  // Memoized columns definition to prevent re-rendering
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "volunteerId", headerName: "Volunteer ID", width: 120 },
      { field: "disable", headerName: "Disable", width: 100, editable: true, type: "boolean" },
      { field: "disable_status", headerName: "Status", width: 150, editable: true },
      { field: "fname", headerName: "First Name", width: 130, editable: true },
      { field: "lname", headerName: "Last Name", width: 130, editable: true },
      { field: "mname", headerName: "Middle Name", width: 130, editable: true },
      { field: "momName", headerName: "Mother's Name", width: 130, editable: true },
      { field: "phone", headerName: "Phone", width: 130, editable: true },
      { field: "email", headerName: "Email", width: 180, editable: true },
      { field: "bDate", headerName: "Birth Date", width: 130, editable: true },
      {
        field: "gender",
        headerName: "Gender",
        width: 120,
        editable: true,
        type: "singleSelect",
        valueOptions: ["Male", "Female"],
      },
      { field: "study", headerName: "Study", width: 150, editable: true },
      { field: "work", headerName: "Work", width: 150, editable: true },
      { field: "city", headerName: "City", width: 120, editable: true },
      { field: "street", headerName: "Street", width: 120, editable: true },
      { field: "nationalNumber", headerName: "National ID", width: 150, editable: true },
      { field: "fixPhone", headerName: "Fixed Phone", width: 130, editable: true },
      { field: "smoking", headerName: "Smoking", width: 100, type: "boolean", editable: true },
      { field: "notes", headerName: "Notes", width: 200, editable: true },
      { field: "prevVol", headerName: "Previous Volunteer", width: 150, editable: true },
      { field: "compSkilles", headerName: "Computer Skills", width: 150, editable: true },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 150,
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === "edit";
          return [
            !isInEditMode && (
              <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEditClick(id)} />
            ),
            !isInEditMode && (
              <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleOpenDeleteDialog(id)} />
            ),
            isInEditMode && (
              <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={() => handleSave(id)} />
            ),
            isInEditMode && (
              <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={() => handleCancel(id)} />
            ),
          ].filter(Boolean);
        },
      },
    ],
    [rowModesModel]
  );
  
  // Fetch volunteers with associated Person data
  useEffect(() => {
    async function fetchVolunteers() {
      setIsLoading(true);
      try {
        const response = await axios.get("/volunteer");

        if (response && response.status === 200) {
          const enrichedData = response.data.map((volunteer:any) => ({
            ...volunteer,
            ...volunteer.Person || {},
            ...volunteer.Person.Address,
            personId: volunteer.Person?.id,
            addressId: volunteer.Person?.Address?.id,
          }));
          setRows(enrichedData);
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

  // Handle row edit
  const handleEditClick = (id: any) => {
    const currentRow: any = rows.find((row: any) => row.volunteerId === id);
    setOldRow(currentRow);
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "edit" } }));
    apiRef.current.setCellFocus(id, "disable");
  };

  // Save row updates
  const handleSave = async (id: any) => {
    setAction("save");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  };

  // Cancel row updates
  const handleCancel = (id: any) => {
    setAction("cancel");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (id: any) => {
    setRowToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  // Delete row using personId and addressId for the backend
const handleDelete = async () => {
  try {
    // Retrieve personId and addressId from the row to delete
    const row:any = rows.find((row:any) => row.volunteerId === rowToDelete);

    // Delete volunteer data
    await axios.delete(`/volunteer/${rowToDelete}`);
    
    // Delete associated person and address data
    await axios.delete(`/person/${row.personId}`);
    await axios.delete(`/address/${row.addressId}`);

    // Update the rows state after deletion
    setRows((prevRows) => prevRows.filter((row:any) => row.volunteerId !== rowToDelete));
    handleCloseDeleteDialog();
  } catch (error) {
    console.error("Error deleting volunteer and related data:", error);
  }
};


  // Process row update for Volunteer, Person, and Address data
  const processRowUpdate = async (updatedRow: any) => {
    if (action === "save") {
      try {
        const {
          volunteerId,
          disable,
          disable_status,
          personId,
          fname,
          lname,
          mname,
          momName,
          phone,
          email,
          bDate,
          gender,
          study,
          work,
          nationalNumber,
          fixPhone,
          smoking,
          notes,
          prevVol,
          compSkilles,
          addressId,
          country,
          state,
          city,
          street,
          village,
        } = updatedRow;

        // Update volunteer data
        const volunteerResponse = await axios.put(`/volunteer/${volunteerId}`, {
          disable,
          disable_status,
        });

        // Update person data
        const personResponse = await axios.put(`/person/${personId}`, {
          fname,
          lname,
          mname,
          momName,
          phone,
          email,
          bDate,
          gender,
          study,
          work,
          nationalNumber,
          fixPhone,
          smoking,
          notes,
          prevVol,
          compSkilles,
        });

        // Update address data
        const addressResponse = await axios.put(`/address/${addressId}`, {
          country,
          state,
          city,
          street,
          village,
        });

        if (
          volunteerResponse.status === 200 &&
          personResponse.status === 200 &&
          addressResponse.status === 200
        ) {
          setRows((prevRows: any) =>
            prevRows.map((row: any) =>
              row.volunteerId === volunteerId ? updatedRow : row
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
        prevRows.map((row: any) =>
          row.volunteerId === updatedRow.volunteerId ? oldRow : row
        )
      );
      return oldRow;
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <Stack direction="row" justifyContent="flex-start" sx={{ gap: 1 }}>
        <Button
          type="button"
          variant="contained"
          onClick={() => navigate("/volunteer-information")}
        >
          Add New Volunteer
        </Button>
      </Stack>
      <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
          rows={rows.map((row:any) => ({ ...row, id: row.volunteerId }))} // Use volunteerId as unique key
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
          editMode="row"
          rowModesModel={rowModesModel}
          processRowUpdate={processRowUpdate}
          apiRef={apiRef}
          getRowId={(row) => row.volunteerId} // Ensure unique row ID
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

export default Volunteer;

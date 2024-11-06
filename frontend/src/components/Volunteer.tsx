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
import DownloadButton from "./DownloadButton";
import Address from "./Address";
import FileUpload from "./FileUpload";
const Volunteer = () => {
  const [rows, setRows] = useState([]);
  // const [oldRow, setOldRow] = useState<any>({});
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<any | null>(null);
  const [fileId, setFileId] = useState<number | null>(null);
  const [updatedFile, setUpdatedFile] = useState<any | null>(null);
  const [oldFile, setOldFile] = useState<any | null>(null);
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const paginationModel = { page: 0, pageSize: 5 };

  // Memoized columns definition to prevent re-rendering
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "volunteerId", headerName: "Volunteer ID", width: 120 },
      {
        field: "active_status",
        headerName: "Active_status",
        width: 100,
        editable: true,
        type: "boolean",
      },

      { field: "fname", headerName: "First Name", width: 130, editable: true },
      { field: "lname", headerName: "Last Name", width: 130, editable: true },
      { field: "mname", headerName: "Middle Name", width: 130, editable: true },
      {
        field: "momName",
        headerName: "Mother's Name",
        width: 130,
        editable: true,
      },
      { field: "phone", headerName: "Phone", width: 130, editable: true },
      { field: "email", headerName: "Email", width: 180, editable: true },
      { field: "bDate", headerName: "Birth Date", width: 350, editable: true },
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
      {
        field: "address",
        headerName: "Address",
        width: 350,
        editable: true,
        renderEditCell: (params) => <Address setAddressId={setAddressId} />,
      },

      {
        field: "nationalNumber",
        headerName: "National ID",
        width: 150,
        editable: true,
      },
      {
        field: "fixPhone",
        headerName: "Fixed Phone",
        width: 130,
        editable: true,
      },
      {
        field: "smoking",
        headerName: "Smoking",
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        width: 100,
        editable: true,
      },
      { field: "note", headerName: "Note", width: 200, editable: true },
      {
        field: "prevVol",
        headerName: "Previous Volunteer",
        width: 150,
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        editable: true,
      },
      {
        field: "compSkill",
        headerName: "Computer Skills",
        width: 150,
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        editable: true,
      },
      {
        field: "koboSkill",
        headerName: "Kobo Skills",
        width: 150,
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        editable: true,
      },
      {
        field: "file",
        headerName: "CV",
        renderCell: (params) => {
          // console.log(params.row);
          return (
            <DownloadButton
              fileName={`${params.row.fname} CV`}
              fileBinary={params.row.File?.file?.data}
            />
          );
        },
        editable: true,
        renderEditCell: (params) => {
          // console.log(params.row);
          return (
            <FileUpload
              fileId={params.row.fileId as number}
              setFileId={setFileId}
              setUpdatedFile={setUpdatedFile}
              mode={"edit"}
            />
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 150,
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === "edit";
          return [
            !isInEditMode && (
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                onClick={() => handleEditClick(id)}
              />
            ),
            !isInEditMode && (
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleOpenDeleteDialog(id)}
              />
            ),
            isInEditMode && (
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                onClick={() => handleSave(id)}
              />
            ),
            isInEditMode && (
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                onClick={() => handleCancel(id)}
              />
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

            personId: volunteer.Person?.id,
            fileId: volunteer.Person.fileId,
            file: volunteer?.Person?.File?.file.data,
            addressId: volunteer.Person?.Address?.id,
          }));
          setRows(enrichedData);
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

  // Handle row edit
  const handleEditClick = (id: any) => {
    console.log({ rows });
    // const currentRow: any = rows.find((row: any) => row.volunteerId === id);
    // setOldRow(currentRow);
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

  useEffect(() => {
    async function fetchAddress(id: any) {
      try {
        // Update the endpoint to match your backend route
        const response = await axios.get(`/address?id=${id}`);
        if (response.status === 200) {
          setNewAddress(response.data);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    }
    if (addressId) fetchAddress(addressId);
  }, [addressId]);

  // useEffect(() => {
  //   console.log({ newAddress });
  // }, [newAddress]);
  // Delete row using personId and addressId for the backend
  const handleDelete = async () => {
    try {
      // Retrieve personId and addressId from the row to delete
      const row: any = rows.find((row: any) => row.volunteerId === rowToDelete);

      // Delete volunteer data
      await axios.delete(`/volunteer/${rowToDelete}`);

      // Delete associated person and address data
      await axios.delete(`/person/${row.personId}`);
      // await axios.delete(`/address/${row.addressId}`);

      // Update the rows state after deletion
      setRows((prevRows) =>
        prevRows.filter((row: any) => row.volunteerId !== rowToDelete)
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting volunteer and related data:", error);
    }
  };
  useEffect(() => {
    console.log({ updatedFile });
  }, [updatedFile]);

  const handleFileUpload = async (base64FileData: string) => {
    const response = await axios.put(`file/${fileId}`, {
      fileData: base64FileData,
    });
  };

  const deleteFile = async (id: number, clearFile: boolean = true) => {
    try {
      console.log({ id });
      const response = await axios.delete(`file/${id}`);
      if (response.status === 200) {
        setFileId(null);
        if (clearFile) setOldFile(null);
      }
    } catch (error) {
      console.error("File deletion failed:", error);
    }
  };
  // Process row update for Volunteer, Person, and Address data
  const processRowUpdate = async (updatedRow: any) => {
    if (action === "save") {
      try {
        const address = `${newAddress?.state?.split("/")[1] || ""} - ${
          newAddress?.city?.split("/")[1] || ""
        } - ${newAddress?.district?.split("/")[1] || ""} - ${
          newAddress?.village?.split("/")[1] || ""
        }`;
        
        console.log(address);
        const {
          volunteerId,
          active_status,
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
          note,
          prevVol,
          compSkill,
          koboSkill,
        } = updatedRow;
        console.log("updatedRow: ", updatedRow);
        // Update volunteer data
        const volunteerResponse = await axios.put(`/volunteer/${volunteerId}`, {
          active_status,
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
          note,
          prevVol,
          koboSkill,
          compSkill,
          addressId,
          fileId,
        });

        if (
          volunteerResponse.status === 200 &&
          personResponse.status === 200
          /*&&
          addressResponse.status === 200*/
        ) {
          setRows((prevRows: any) =>
            prevRows.map((row: any) => {
              console.log(row);
              return row.volunteerId === volunteerId
                ? {
                    ...updatedRow,
                    file: updatedFile,
                    File: {
                      id: fileId,
                      file: updatedFile,
                    },
                    address,
                    addressId,
                  }
                : row;
            })
          );

          return {
            ...updatedRow,
            file: updatedFile,
            File: {
              id: fileId,
              file: updatedFile,
            },
            address,
            addressId,
          };
        } else {
          throw new Error("Failed to update row");
        }
      } catch (error) {
        console.error("Error updating row:", error);
        throw error;
      }
    } else if (action === "cancel") {
      const oldRow: any = rows.find(
        (row: any) => row.volunteerId === updatedRow.volunteerId
      );
      console.log({ oldRow });
      console.log({ updatedRow });
      if (updatedFile) {
        handleFileUpload(oldRow.file);
      }

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
          rows={rows.map((row: any) => ({ ...row, id: row?.volunteerId }))} // Use volunteerId as unique key
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

export default Volunteer;

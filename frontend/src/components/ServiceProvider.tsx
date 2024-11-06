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
import { TextField } from "@mui/material";

const ServiceProvider = () => {
  const [rows, setRows] = useState([]);
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [address, setAddress] = useState<number | null>(null);

  const [addressId, setAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<number | any>(null);
  const [fileId, setFileId] = useState<number | null>(null);
  const [oldFile, setOldFile] = useState<any | null>(null);
  const [updatedFile, setUpdatedFile] = useState(null);
  const [departments, setDepartments] = useState<any>([{}]);
  const [positions, setPositions] = useState<any>([{}]);
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const paginationModel = { page: 0, pageSize: 5 };
  const [oldBdate, setOldBdate] = useState<any>(null);
  const [newBdate, setNewBdate] = useState<any>(null);

  const [departmentId, setDepartmentId] = useState<number | null>(null); // Store selected department ID
  const [positionId, setPositionId] = useState<number | null>(null); // Track selected position ID

  // Initialize departments and positions with default values if empty
  const departmentOptions = useMemo(
    () =>
      departments.length > 0
        ? departments.map((department: any) => ({
            label: department.name,
            id: department.id,
          }))
        : [{ label: "No Departments Available", id: null }],
    [departments]
  );

  const positionOptions = useMemo(
    () =>
      positions.length > 0
        ? positions.map((position: any) => ({
            label: position.name,
            id: position.id,
          }))
        : [{ label: "No Positions Available", id: null }],
    [positions]
  );
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "providerId", headerName: "Provider ID", width: 120 },
      {
        field: "position",
        headerName: "Position",
        width: 150,
        type: "singleSelect",
        valueOptions: positionOptions.map((option: any) => option.label),
        editable: true,
      },
      {
        field: "department",
        headerName: "Department",
        width: 150,
        type: "singleSelect",
        valueOptions: departmentOptions.map((option: any) => option.label),
        editable: true,
      },

      { field: "fname", headerName: "First Name", width: 130, editable: true },
      { field: "lname", headerName: "Last Name", width: 130, editable: true },
      { field: "mname", headerName: "Middle Name", width: 130, editable: true },
      {
        field: "momname",
        headerName: "Mother's Name",
        width: 130,
        editable: true,
      },
      { field: "phone", headerName: "Phone", width: 130, editable: true },
      { field: "email", headerName: "Email", width: 180, editable: true },
      {
        field: "bDate",
        headerName: "Birth Date",
        width: 350,
        editable: true,
        renderEditCell: (params) => (
          <TextField
            type="date"
            value={newBdate}
            onChange={(e: any) => setNewBdate(e.target.value)}
            fullWidth
          />
        ),
      },
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
    [rowModesModel, departmentOptions, positionOptions]
  );

  useEffect(() => {
    async function fetchServiceProviders() {
      setIsLoading(true);
      try {
        const response = await axios.get("/serviceprovider");
        if (response && response.status === 200) {
          const enrichedData = response.data.map((provider: any) => ({
            providerId: provider.providerId,
            position: provider.Position?.name,
            department: provider.Department?.name,
            ...(provider.Volunteer.Person || {}),
            address: `${provider?.Volunteer?.Person?.Address?.state || ""} - ${
              provider?.Volunteer?.Person?.Address?.city || ""
            } - ${provider?.Volunteer?.Person?.Address?.district || ""} - ${
              provider?.Volunteer?.Person?.Address?.village || ""
            }`,
            personId: provider?.Volunteer?.Person?.id,
            fileId: provider?.Volunteer?.Person?.fileId,
            file: provider?.Volunteer.Person?.File?.file.data,
            addressId: provider?.Volunteer?.Person?.Address?.id,
            positionId: provider.Position?.id,
            departmentId: provider.Department?.id,
          }));
          console.log("the enricheddata is ", enrichedData);
          setRows(enrichedData);
        }
      } catch (error) {
        console.error("Error fetching service providers:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServiceProviders();
  }, []);
  // Handle row edit
  const handleEditClick = (id: any) => {
    console.log({ rows });
    const currentRow: any = rows.find((row: any) => row.providerId === id);
    if (currentRow) {
      // Set the initial departmentId when entering edit mode
      setFileId(currentRow.fileId);
      setAddressId(currentRow.addressId);
      setAddress(currentRow.address);
      setDepartmentId(currentRow?.departmentId || null);
      setPositionId(currentRow?.positionId || null);
      setOldBdate(currentRow?.bDate || null);
    }
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
    setNewBdate(oldBdate);
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

  //fetch departments and position
  useEffect(() => {
    async function fetchDepartment() {
      const res = await axios.get("department");
      if (res.status === 200) {
        setDepartments(res.data);
      }
    }
    async function fetchPosition() {
      const res = await axios.get("position");
      if (res.status === 200) {
        setPositions(res.data);
      }
    }
    fetchPosition();

    fetchDepartment();

    console.log("departments", departments);
    console.log("positions", positions);
  }, []);

  const handleDelete = async () => {
    try {
      const row: any = rows.find((row: any) => row.providerId === rowToDelete);
      await axios.delete(`/serviceprovider/${rowToDelete}`);
      // Delete volunteer data
      await axios.delete(`/volunteer/${row.volunteerId}`);
      // Delete associated person and address data
      await axios.delete(`/person/${row.personId}`);
      //  await axios.delete(`/address/${row.addressId}`);
      setRows((prevRows) =>
        prevRows.filter((row: any) => row.providerId !== rowToDelete)
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting service provider:", error);
    }
  };

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
  console.log("deprtmrntID is ", departmentId);
  console.log("positionID is ", positionId);
  console.log("print oldBdate", oldBdate);
  console.log("print newBdate", newBdate);
  const processRowUpdate = async (updatedRow: any) => {
    if (action === "save") {
      try {
        const updatedAddress = `${newAddress?.state?.split("/")[1] || ""} - ${
          newAddress?.city?.split("/")[1] || ""
        } - ${newAddress?.district?.split("/")[1] || ""} - ${
          newAddress?.village?.split("/")[1] || ""
        }`;
        // Detect changes and update departmentId and positionId accordingly
        const selectedDepartment = departmentOptions.find(
          (dept: any) => dept.label === updatedRow.department
        );
        const selectedPosition = positionOptions.find(
          (pos: any) => pos.label === updatedRow.position
        );

        const updatedDepartmentId = selectedDepartment?.id || departmentId;
        const updatedPositionId = selectedPosition?.id || positionId;
        const updatedBdate = newBdate || oldBdate;

        // Ensure these IDs are included in the updatedRow before saving
        updatedRow.departmentId = updatedDepartmentId;
        updatedRow.positionId = updatedPositionId;
        updatedRow.bDate = updatedBdate;
        const {
          providerId,
          personId,
          //  positionId,
          // departmentId,
          // volunteerId,
          // active_status,
          fname,
          lname,
          mname,
          momname,
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
        await axios.put(`/serviceprovider/${providerId}`, {
          positionId: updatedPositionId,
          departmentId: updatedDepartmentId,
        });
        await axios.put(`/person/${personId}`, {
          fname,
          lname,
          mname,
          momname,
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
        setRows((prevRows: any) =>
          prevRows.map((row: any) =>
            row.providerId === providerId
              ? {
                  ...updatedRow,
                  address: updatedAddress ? updatedAddress : address,
                  addressId: addressId,

                  positionId: updatedPositionId,
                  departmentId: updatedDepartmentId,
                  bDate: updatedBdate,
                  file: updatedFile ? updatedFile : updatedRow.file,
                  File: updatedFile
                    ? {
                        id: fileId,
                        file: updatedFile,
                      }
                    : updatedRow.File,
                }
              : row
          )
        );
        return {
          ...updatedRow,

          file: updatedFile ? updatedFile : updatedRow.file,
          File: updatedFile
            ? {
                id: fileId,
                file: updatedFile,
              }
            : updatedRow.File,
          address: address ? address : updatedRow.address,
          addressId: addressId ? addressId : updatedRow.addressId,
          positionId: updatedPositionId,
          departmentId: updatedDepartmentId,
          bDate: updatedBdate,
        };
      } catch (error) {
        console.error("Error updating row:", error);
        throw error;
      }
    } else if (action === "cancel") {
      const oldRow: any = rows.find(
        (row: any) => row.providerId === updatedRow.providerId
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
          variant="contained"
          onClick={() => navigate("/serviceprovider-information")}
        >
          Add New Service Provider
        </Button>
      </Stack>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows.map((row: any) => ({ ...row, id: row.providerId }))}
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
      <DraggableDialog
        open={isDeleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ServiceProvider;

import { useEffect, useState, useMemo } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
} from "@mui/x-data-grid";

import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Loading } from "./Loading";
import { ReportModal } from "./ReportModal";

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
type UserType = {
  userId: number;
  ServiceProvider: {
    Volunteer: {
      Person: {
        Address: {
          state: string;
          city: string;
          district: string;
          village: string;
        };
        fname: string;
        mname: string;
        momname: string;
        lname: string;
        email: string;
        phone: string;
        fixPhone: string;
        nationalNumber: string;
        city: string;
        street: string;
        study: string;
        work: string;
        gender: string;
        bDate: string;
        smoking: string;
        prevVol: string;
        compSkill: string;
        koboSkill: string;
        note: string;
        File: { id: number; file: { type: string; data: number[] } };
      };
    };
    Position: { name: string };
    Department: { name: string; description: string };
  };
  Role: { name: string; description: string };
};

export function UserManagement() {
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
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
  const [roles, setRoles] = useState<any>([{}]);
  const [roleId, setRoleId] = useState<number | null>(null); // Track selected role ID

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
  const roleOptions = useMemo(
    () =>
      roles.length > 0
        ? roles.map((role: any) => ({
            label: role.name,
            id: role.id,
          }))
        : [{ label: "No Roles Available", id: null }],
    [roles]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "userId", headerName: "ID", minWidth: 150, editable: true },
      {
        field: "fullName",
        headerName: "Full name",
        description: "This column has a value getter and is not sortable.",
        valueGetter: (_value, row) => `${row.fname || ""} ${row.lname || ""}`,
        minWidth: 150,
        editable: true,
      },
      {
        field: "fname",
        headerName: "First name",
        minWidth: 150,
        editable: true,
      },
      {
        field: "mname",
        headerName: "Middle name",
        minWidth: 150,
        editable: true,
      },
      {
        field: "momname",
        headerName: "Mother name",
        minWidth: 150,
        editable: true,
      },
      {
        field: "lname",
        headerName: "Last name",
        minWidth: 150,
        editable: true,
      },
      { field: "email", headerName: "Email", minWidth: 150, editable: true },
      { field: "phone", headerName: "Phone", minWidth: 150, editable: true },
      {
        field: "fixPhone",
        headerName: "Fix Phone",
        minWidth: 150,
        editable: true,
      },
      {
        field: "position",
        headerName: "Position",
        width: 150,
        type: "singleSelect",
        valueOptions: positionOptions.map((option: any) => option.label),
        editable: true,
      },
      { field: "study", headerName: "Study", minWidth: 150, editable: true },
      {
        field: "address",
        headerName: "Address",
        width: 350,
        editable: true,
        renderEditCell: (params) => <Address setAddressId={setAddressId} />,
      },
      { field: "work", headerName: "Work", minWidth: 150, editable: true },
      {
        field: "nationalNumber",
        headerName: "National Number",
        minWidth: 150,
        editable: true,
      },
      {
        field: "gender",
        headerName: "Gender",
        minWidth: 150,
        editable: true,
        type: "singleSelect",
        valueOptions: ["male", "female"],
      },
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
        field: "prevVol",
        headerName: "Previous Volunteer",
        width: 150,
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
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
      {
        field: "role",
        headerName: "Role Name",
        minWidth: 150,
        type: "singleSelect",
        valueOptions: roleOptions.map((option: any) => option.label),
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

      {
        field: "note",
        headerName: "Notes",
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
    [rowModesModel, departmentOptions, positionOptions, roleOptions]
  );

  useEffect(() => {
    console.log(rows);
  }, [rows]);

  useEffect(() => {
    async function fetchUserData() {
      const userData = await axios
        .get("/user/")
        .then((res) => {
          const userRows = res.data.map((user: any) => {
            console.log(user);
            return {
              userId: user?.userId,

              fname: user?.ServiceProvider?.Volunteer?.Person?.fname,
              mname: user?.ServiceProvider?.Volunteer?.Person?.mname,
              momname: user?.ServiceProvider?.Volunteer?.Person?.momname,
              lname: user?.ServiceProvider?.Volunteer?.Person?.lname,
              email: user?.ServiceProvider?.Volunteer?.Person?.email,
              phone: user?.ServiceProvider?.Volunteer?.Person?.phone,
              fixPhone: user?.ServiceProvider?.Volunteer?.Person?.fixPhone,
              smoking: user?.ServiceProvider?.Volunteer?.Person?.smoking,
              prevVol: user?.ServiceProvider?.Volunteer?.Person?.prevVol,
              compSkill: user?.ServiceProvider?.Volunteer?.Person?.compSkill,
              koboSkill: user?.ServiceProvider?.Volunteer?.Person?.koboSkill,
              note: user?.ServiceProvider?.Volunteer?.Person?.note,
              position: user?.ServiceProvider?.Position?.name,
              study: user?.ServiceProvider?.Volunteer?.Person?.study,
              work: user?.ServiceProvider?.Volunteer?.Person?.work,
              nationalNumber:
                user?.ServiceProvider?.Volunteer?.Person?.nationalNumber,
              address: `${
                user?.ServiceProvider?.Volunteer?.Person?.Address?.state.split(
                  "/"
                )[1]
              } - ${
                user?.ServiceProvider?.Volunteer?.Person?.Address?.city.split(
                  "/"
                )[1]
              } - ${
                user?.ServiceProvider?.Volunteer?.Person?.Address?.district.split(
                  "/"
                )[1]
              } - ${
                user?.ServiceProvider?.Volunteer?.Person?.Address?.village.split(
                  "/"
                )[1]
              }`,
              gender: user?.ServiceProvider?.Volunteer?.Person?.gender,
              bDate: user?.ServiceProvider?.Volunteer?.Person?.bDate,

              role: user?.Role?.name,

              department: user?.ServiceProvider?.Department?.name,

              file: user?.ServiceProvider?.Volunteer?.Person?.File?.file.data,
              providerId: user?.ServiceProvider?.providerId,
              personId: user?.ServiceProvider?.Volunteer?.Person?.id,
              fileId: user?.ServiceProvider?.Volunteer?.Person?.fileId,

              addressId: user?.ServiceProvider?.Volunteer?.Person?.Address?.id,
              positionId: user?.ServiceProvider?.Position?.id,
              departmentId: user?.ServiceProvider?.Department?.id,
            };
          });
          setRows(userRows);
        })
        .catch((err) => {
          console.error(err);
          // setError(err);
        })
        .finally(() => setIsLoading(false));
      return userData;
    }

    fetchUserData();
    // const refreshToken = Cookies.get("refresh_token");
    // getRefreshToken(refreshToken as string);
  }, []);

  // Handle row edit
  const handleEditClick = (id: any) => {
    console.log({ rows });
    const currentRow: any = rows.find((row: any) => row.userId === id);

    if (currentRow) {
      // Set the initial values when entering edit mode
      setFileId(currentRow.fileId);
      setAddressId(currentRow.addressId);
      setAddress(currentRow.address);
      setDepartmentId(currentRow?.departmentId || null);
      setPositionId(currentRow?.positionId || null);
      setRoleId(currentRow?.roleId || null); // Set the role ID
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
  // const handleCancel = (id: any) => {

  //   setAction("cancel"); setNewBdate(oldBdate);

  //   setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } })); // Revert other state variables to their original values

  // setFileId(null);

  // setAddressId(null); setAddress(null); setDepartmentId(null); setPositionId(null); setRoleId(null); };

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
    async function fetchRoles() {
      const res = await axios.get("role");
      if (res.status === 200) {
        setRoles(res.data);
      }
    }

    // Fetch departments, positions, and roles
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

    fetchRoles();
    fetchPosition();
    fetchDepartment();

    console.log("departments", departments);
    console.log("positions", positions);
    console.log("roles", roles);
  }, []);

  const handleDelete = async () => {
    try {
      const row: any = rows.find((row: any) => row.userId === rowToDelete);
      await axios.delete(`/user/${rowToDelete}`);

      await axios.delete(`/serviceprovider/${row.providerId}`);
      // Delete volunteer data
      await axios.delete(`/volunteer/${row.volunteerId}`);
      // Delete associated person and address data
      await axios.delete(`/person/${row.personId}`);
      //  await axios.delete(`/address/${row.addressId}`);
      setRows((prevRows) =>
        prevRows.filter((row: any) => row.userId !== rowToDelete)
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

        const selectedRole = roleOptions.find(
          (rol: any) => rol.label === updatedRow.role
        );

        const updatedDepartmentId = selectedDepartment?.id || departmentId;
        const updatedPositionId = selectedPosition?.id || positionId;
        const updatedRoleId = selectedRole?.id || roleId;
        const updatedBdate = newBdate || oldBdate;

        // Ensure these IDs are included in the updatedRow before saving
        updatedRow.departmentId = updatedDepartmentId;
        updatedRow.positionId = updatedPositionId;
        updatedRow.bDate = updatedBdate;
        const {
          userId,
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

        await axios.put(`/user/${userId}`, {
          roleId: updatedRoleId,
        });

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
            row.userId === userId
              ? {
                  ...updatedRow,
                  address: updatedAddress ? updatedAddress : address,
                  addressId: addressId,
                  roleId: updatedRoleId,
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
          roleId: updatedRoleId,
          bDate: updatedBdate,
        };
      } catch (error) {
        console.error("Error updating row:", error);
        throw error;
      }
    } else if (action === "cancel") {
      const oldRow: any = rows.find(
        (row: any) => row.userId === updatedRow.userId
      );
      console.log({ oldRow });
      console.log({ updatedRow });
      // if (oldRow) {
      //   setRows((prevRows: any) =>
      //     prevRows.map((row: any) =>
      //       row.userId === updatedRow.userId ? oldRow : row
      //     )
      //   );
      //   return oldRow;
      // }
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
          onClick={() => navigate("/create-new-user")}
        >
          Add New User
        </Button>
      </Stack>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows.map((row: any) => ({ ...row, id: row?.userId }))}
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
}

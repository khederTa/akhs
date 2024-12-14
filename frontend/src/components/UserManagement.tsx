/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  DataGrid,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
} from "@mui/x-data-grid";

import Paper from "@mui/material/Paper";
import { Stack, Tooltip } from "@mui/material";

import { Loading } from "./Loading";
import LockOpenIcon from '@mui/icons-material/LockOpen';
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
import FilterHeader from "./FilterHeader";
import OptionFilterHeader from "./OptionFilterHeader";
import GenderFilterHeader from "./GenderFilterHeader";
import DateFilterHeader from "./DateFilterHeader";
import CustomDateRenderer from "./CustomDateRenderer";
import QAFilterHeader from "./QAFilterHeader";
import { AntSwitch } from "./Volunteer";
import GridCustomToolbar from "./GridCustomToolbar";
import AlertNotification from "./AlertNotification";
import { useTranslation } from "react-i18next";
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import { usePermissionStore } from "../store/permissionStore";
import { useAuthStore } from "../store/auth";
import ChangePasswordByAdminModal from "./ChangePasswordByAdminModal";
// type UserType = {
//   userId: number;
//   ServiceProvider: {
//     Volunteer: {
//       Person: {
//         Address: {
//           state: string;
//           city: string;
//           district: string;
//           village: string;
//         };
//         fname: string;
//         mname: string;
//         momname: string;
//         lname: string;
//         email: string;
//         phone: string;
//         fixPhone: string;
//         nationalNumber: string;
//         city: string;
//         street: string;
//         study: string;
//         work: string;
//         gender: string;
//         bDate: string;
//         smoking: string;
//         prevVol: string;
//         compSkill: string;
//         koboSkill: string;
//         note: string;
//         File: { id: number; file: { type: string; data: number[] } };
//       };
//     };
//     Position: { name: string };
//     Department: { name: string; description: string };
//   };
//   Role: { name: string; description: string };
// };

export function UserManagement() {
  const counterMount = useRef(0);
  useEffect(() => {
    counterMount.current += 1;
    console.log(counterMount.current);
  });
  const [rows, setRows] = useState<any[]>([]);
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [address, setAddress] = useState<number | null>(null);
  const userId = useAuthStore((state) => state.allUserData?.userId);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number>(-1);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<number | any>(null);
  const [fileId, setFileId] = useState<number | null>(null);
  const [updatedFile, setUpdatedFile] = useState<any>(null);
  const [departments, setDepartments] = useState<any>([{}]);
  const [positions, setPositions] = useState<any>([{}]);
  const apiRef = useGridApiRef();
  const paginationModel = { page: 0, pageSize: 5 };
  const [oldBdate, setOldBdate] = useState<any>(null);
  const [newBdate, setNewBdate] = useState<any>(null);

  const [departmentId, setDepartmentId] = useState<number | null>(null); // Store selected department ID
  const [positionId, setPositionId] = useState<number | null>(null); // Track selected position ID
  const [roles, setRoles] = useState<any>([{}]);
  const [roleId, setRoleId] = useState<number | null>(null); // Track selected role ID

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const handleAlertClose = useCallback(() => {
    setAlertOpen(false);
  }, []);
  const [uploadFileSizeError, setUploadFileSizeError] = useState("");

  useEffect(() => {
    if (uploadFileSizeError.length > 0) {
      setAlertMessage(uploadFileSizeError);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  }, [uploadFileSizeError]);
  const { t } = useTranslation();
  const { userRole } = usePermissionStore((state) => state);
  const {
    filteredRows,
    sortModel,
    filterModel,
    filterVisibility,
    setFilteredRows,
    setFilterVisibility,
    handleTextFilterChange,
    handleDateFilterChange,
    clearFilter,
    clearAllFilters,
    handleSortClick,
  } = useGridFilterSort({
    initialFilterModel: {
      fname: "",
      lname: "",
      mname: "",
      momName: "",
      phone: "",
      email: "",
      gender: "",
      study: "",
      work: "",
      address: "",
      nationalNumber: "",
      fixPhone: "",
      position: "",
      department: "",
      compSkills: "",
      koboSkils: "",
      prevVol: "",
      smoking: "",
      bDate: { value: "", operator: "equals", endDate: "" },
    },
    initialFilterVisibility: {
      fname: false,
      lname: false,
      mname: false,
      momName: false,
      phone: false,
      email: false,
      gender: false,
      study: false,
      work: false,
      address: false,
      nationalNumber: false,
      fixPhone: false,
      bDate: false,
      position: false,
      department: false,
      compSkills: false,
      koboSkils: false,
      prevVol: false,
      smoking: false,
    },
    rows, // your initial rows data
  });
  // active / inactive volunteer
  const handleToggleActive = useCallback(
    async (id: number) => {
      const rowIndex = rows.findIndex((row: any) => row.userId === id);
      if (rowIndex === -1) return;

      const volunteerId = rows[rowIndex].volunteerId;
      // Toggle active_status
      const updatedActiveStatus =
        rows[rowIndex].active_status === "active" ? "inactive" : "active";
      const updatedRow = {
        ...rows[rowIndex],
        active_status: updatedActiveStatus,
      };
      console.log(volunteerId);
      try {
        // Update the backend
        const response = await axios.put(`/volunteer/${volunteerId}`, {
          active_status: updatedActiveStatus,
        });
        if (response.status === 200) {
          console.log("Toggle is done");
          // Update the rows state
          const updatedRows = [...rows];
          updatedRows[rowIndex] = updatedRow;
          setRows(updatedRows);

          // Update filteredRows if it includes the row
          const filteredRowIndex = filteredRows.findIndex(
            (row: any) => row.userId === id
          );
          if (filteredRowIndex !== -1) {
            const updatedFilteredRows = [...filteredRows];
            updatedFilteredRows[filteredRowIndex] = updatedRow as never;
            setFilteredRows(updatedFilteredRows);
          }
        }
      } catch (error) {
        console.error("Error updating active status:", error);
      }
    },
    [filteredRows, rows, setFilteredRows]
  );

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

  // Handle row edit
  const handleEditClick = useCallback(
    (id: any) => {
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
    },
    [apiRef, rows]
  );

  // Save row updates
  const handleSave = useCallback(async (id: any) => {
    setAction("save");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  }, []);

  // Cancel row updates
  const handleCancel = useCallback(
    (id: any) => {
      setAction("cancel");
      setNewBdate(oldBdate);
      setFileId(null);
      setUpdatedFile(null);
      setAddressId(null);
      setAddress(null);
      setDepartmentId(null);
      setPositionId(null);
      setRoleId(null);
      setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } })); // Revert other state variables to their original values
    },
    [oldBdate]
  );

  // const handleCancel = (id: any) => {

  //   setAction("cancel"); setNewBdate(oldBdate);

  //   setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } })); // Revert other state variables to their original values

  // setFileId(null);

  // setAddressId(null); setAddress(null); setDepartmentId(null); setPositionId(null); setRoleId(null); };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = useCallback((id: any) => {
    setSelectedRow(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const columns: any[] = useMemo(
    () => [
      {
        field: "userId",
        headerName: t("id"),
        minWidth: 100,
        sortable: true,
        editable: false,
      },
      {
        field: "fname",
        headerName: t("fname"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"fname"}
            field={"fname"}
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
        field: "lname",
        headerName: t("lname"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"lname"}
            field={"lname"}
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
        field: "mname",
        headerName: t("mname"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"mname"}
            field={"mname"}
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
        field: "momname",
        headerName: t("momName"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"momName"}
            field={"momName"}
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
        field: "phone",
        headerName: t("phone"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"phone"}
            field={"phone"}
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
        field: "email",
        headerName: t("email"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"email"}
            field={"email"}
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
        field: "role",
        type: "singleSelect",
        valueOptions: roleOptions.map((option: any) => option.label),
        headerName: t("role"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <OptionFilterHeader
            key={"role"}
            field={"role"}
            options={roleOptions.map((option: any) => option.label)}
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
        field: "position",
        type: "singleSelect",
        valueOptions: positionOptions.map((option: any) => option.label),
        headerName: t("position"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <OptionFilterHeader
            key={"position"}
            field={"position"}
            options={positionOptions.map((option: any) => option.label)}
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
        field: "department",
        valueOptions: departmentOptions.map((option: any) => option.label),
        type: "singleSelect",
        headerName: t("department"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <OptionFilterHeader
            key={"department"}
            field={"department"}
            options={departmentOptions.map((option: any) => option.label)}
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
        field: "fixPhone",
        headerName: t("fixPhone"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"fixPhone"}
            field={"fixPhone"}
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
        field: "nationalNumber",
        headerName: t("nationalNumber"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"nationalNumber"}
            field={"nationalNumber"}
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
        field: "bDate",
        headerName: "Birth Date",
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderCell: (params: { value: string | Date }) => (
          <CustomDateRenderer value={params.value} />
        ),
        renderEditCell: (_params: any) => (
          <TextField
            type="date"
            value={newBdate}
            onChange={(e: any) => setNewBdate(e.target.value)}
            fullWidth
          />
        ),
        renderHeader: () => (
          <DateFilterHeader
            key={"bDate"}
            field={"bDate"}
            filterModel={filterModel}
            sortModel={sortModel}
            filterVisibility={filterVisibility}
            handleSortClick={handleSortClick}
            handleFilterChange={handleDateFilterChange}
            setFilterVisibility={setFilterVisibility}
            clearFilter={clearFilter}
          />
        ),
      },
      {
        field: "gender",
        headerName: t("gender"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <GenderFilterHeader
            key={"gender"}
            field={"gender"}
            filterModel={filterModel}
            sortModel={sortModel}
            filterVisibility={filterVisibility}
            handleSortClick={handleSortClick}
            handleFilterChange={handleTextFilterChange}
            setFilterVisibility={setFilterVisibility}
            clearFilter={clearFilter}
          />
        ),
        type: "singleSelect",
        valueOptions: ["Male", "Female"],
      },
      {
        field: "study",
        headerName: t("study"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"study"}
            field={"study"}
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
        field: "work",
        headerName: t("work"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"work"}
            field={"work"}
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
        field: "address",
        headerName: t("address"),
        minWidth: 650,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <FilterHeader
            key={"address"}
            field={"address"}
            filterModel={filterModel}
            sortModel={sortModel}
            filterVisibility={filterVisibility}
            handleSortClick={handleSortClick}
            handleFilterChange={handleTextFilterChange}
            setFilterVisibility={setFilterVisibility}
            clearFilter={clearFilter}
          />
        ),
        renderEditCell: (_params: any) => (
          <Address setAddressId={setAddressId} />
        ),
      },
      {
        field: "smoking",
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        headerName: t("smoking"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <QAFilterHeader
            key={"smoking"}
            field={"smoking"}
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
        field: "prevVol",
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        headerName: t("prevVol"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <QAFilterHeader
            key={"prevVol"}
            field={"prevVol"}
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
        field: "compSkill",
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        headerName: t("compSkill"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <QAFilterHeader
            key={"compSkill"}
            field={"compSkill"}
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
        field: "koboSkill",
        type: "singleSelect",
        valueOptions: ["Yes", "No"],
        headerName: t("koboSkill"),
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderHeader: () => (
          <QAFilterHeader
            key={"koboSkill"}
            field={"koboSkill"}
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
      { field: "note", headerName: t("note"), width: 200, editable: true },
      {
        field: "file",
        headerName: t("cv"),
        hideSortIcons: true,
        sortable: false,
        renderCell: (params: {
          row: { fname: any; file: number[] | null };
        }) => {
          // console.log(params.row);
          return (
            <DownloadButton
              fileName={`${params.row.fname} CV`}
              fileBinary={params.row?.file}
            />
          );
        },
        editable: true,
        renderEditCell: (params: { row: { fileId: number } }) => {
          console.log(params.row);
          return (
            <FileUpload
              fileId={params.row.fileId as number}
              setFileId={setFileId}
              setUpdatedFile={setUpdatedFile}
              mode={"edit"}
              setUploadFileSizeError={setUploadFileSizeError}
            />
          );
        },
      },
      {
        field: "actions",
        headerName: t("actions"),
        type: "actions",
        width: 150,
        getActions: ({ id }: any) => {
          const row = rows.find((item) => item.userId === id);
          const isInEditMode = rowModesModel[id]?.mode === "edit";
          return [
            !isInEditMode &&
              ((userRole === "officer" && row.role === "data entry") ||
                row.userId === userId ||
                userRole === "admin") && (
                <Tooltip title={t("edit")}>
                  <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleEditClick(id)}
                  />
                </Tooltip>
              ),
            !isInEditMode && userRole === "admin" && (
              <Tooltip title={t("change password")}>
                <GridActionsCellItem
                  icon={<LockOpenIcon />}
                  label="change password"
                  onClick={() => {
                    setSelectedUserId(id);
                    setChangePasswordModalOpen(true);
                  }}
                />
              </Tooltip>
            ),
            !isInEditMode &&
              ((userRole === "officer" && row.role === "data entry") ||
                userRole === "admin") && (
                <Tooltip title={t("delete")}>
                  <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleOpenDeleteDialog(id)}
                  />
                </Tooltip>
              ),
            !isInEditMode &&
              ((userRole === "officer" && row.role === "data entry") ||
                userRole === "admin") && (
                <Tooltip title={t("active / inactive")}>
                  <Stack
                    spacing={1}
                    sx={{
                      display: "flex",
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <AntSwitch
                      defaultChecked={
                        rows.find((row: any) => row.userId === id)
                          ?.active_status === "active"
                      }
                      inputProps={{ "aria-label": "ant design" }}
                      onChange={() => handleToggleActive(id as number)}
                    />
                  </Stack>
                </Tooltip>
              ),
            isInEditMode && (
              <Tooltip title={t("save")}>
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label="Save"
                  onClick={() => handleSave(id)}
                />
              </Tooltip>
            ),
            isInEditMode && (
              <Tooltip title={t("cancel")}>
                <GridActionsCellItem
                  icon={<CancelIcon />}
                  label="Cancel"
                  onClick={() => handleCancel(id)}
                />
              </Tooltip>
            ),
          ].filter(Boolean);
        },
      },
    ],
    [
      t,
      roleOptions,
      positionOptions,
      departmentOptions,
      filterModel,
      sortModel,
      filterVisibility,
      handleSortClick,
      handleTextFilterChange,
      setFilterVisibility,
      clearFilter,
      newBdate,
      handleDateFilterChange,
      rows,
      rowModesModel,
      userRole,
      userId,
      handleEditClick,
      handleOpenDeleteDialog,
      handleToggleActive,
      handleSave,
      handleCancel,
    ]
  );

  useEffect(() => {
    console.log(filteredRows);
  }, [filteredRows]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get("/user");
        if (response.status === 200) {
          const userRows = response.data.map((user: any) => {
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
              address: `${user?.ServiceProvider?.Volunteer?.Person?.Address?.state} - ${user?.ServiceProvider?.Volunteer?.Person?.Address?.city} - ${user?.ServiceProvider?.Volunteer?.Person?.Address?.district} - ${user?.ServiceProvider?.Volunteer?.Person?.Address?.village}`,
              gender: user?.ServiceProvider?.Volunteer?.Person?.gender,
              bDate: user?.ServiceProvider?.Volunteer?.Person?.bDate,
              active_status: user?.ServiceProvider?.Volunteer?.active_status,

              role: user?.Role?.name,

              department: user?.ServiceProvider?.Department?.name,

              file: user?.ServiceProvider?.Volunteer?.Person?.File?.file.data,
              providerId: user?.ServiceProvider?.providerId,
              personId: user?.ServiceProvider?.Volunteer?.Person?.id,
              fileId: user?.ServiceProvider?.Volunteer?.Person?.fileId,

              volunteerId: user?.ServiceProvider?.Volunteer?.volunteerId,
              addressId: user?.ServiceProvider?.Volunteer?.Person?.Address?.id,
              positionId: user?.ServiceProvider?.Position?.id,
              departmentId: user?.ServiceProvider?.Department?.id,
            };
          });
          setRows(userRows);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
    // const refreshToken = Cookies.get("refresh_token");
    // getRefreshToken(refreshToken as string);
  }, []);

  // Close delete dialog
  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedRow(null);
  }, []);

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

    // console.log("departments", departments);
    // console.log("positions", positions);
    // console.log("roles", roles);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      // const row: any = rows.find((row: any) => row.userId === selectedRow);
      await axios.delete(`/user/${selectedRow}`);

      // await axios.delete(`/serviceprovider/${row.providerId}`);
      // Delete volunteer data
      // await axios.delete(`/volunteer/${row.volunteerId}`);
      // Delete associated person and address data
      // await axios.delete(`/person/${row.personId}`);
      //  await axios.delete(`/address/${row.addressId}`);
      setRows((prevRows) =>
        prevRows.filter((row: any) => row.userId !== selectedRow)
      );
      setFilteredRows((prevRows) =>
        prevRows.filter((row: any) => row.userId !== selectedRow)
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting service provider:", error);
    }
  }, [handleCloseDeleteDialog, selectedRow, setFilteredRows]);

  const handleFileUpload = useCallback(
    async (base64FileData: string) => {
      await axios.put(`file/${fileId}`, {
        fileData: base64FileData,
      });
    },
    [fileId]
  );

  // const deleteFile = async (id: number, clearFile: boolean = true) => {
  //   try {
  //     console.log({ id });
  //     const response = await axios.delete(`file/${id}`);
  //     if (response.status === 200) {
  //       setFileId(null);
  //       if (clearFile) setOldFile(null);
  //     }
  //   } catch (error) {
  //     console.error("File deletion failed:", error);
  //   }
  // };

  const processRowUpdate = useCallback(
    async (updatedRow: any) => {
      if (action === "save") {
        try {
          if (
            !updatedRow.nationalNumber ||
            updatedRow.nationalNumber.length === 0
          ) {
            const oldRow: any = rows.find(
              (row: any) => row.userId === updatedRow.userId
            );
            setAlertMessage("national number is required, please try again");
            setAlertSeverity("error");
            setAlertOpen(true);
            return oldRow;
          }
          const updatedAddress = `${newAddress?.state || ""} - ${
            newAddress?.city || ""
          } - ${newAddress?.district || ""} - ${newAddress?.village || ""}`;
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

          const userRes = await axios.put(`/user/${userId}`, {
            roleId: updatedRoleId,
          });

          const providerRes = await axios.put(
            `/serviceprovider/${providerId}`,
            {
              positionId: updatedPositionId,
              departmentId: updatedDepartmentId,
            }
          );
          const personRes = await axios.put(`/person/${personId}`, {
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
          console.log({ userRes, providerRes, personRes });
          if (
            userRes.status === 200 &&
            providerRes.status === 200 &&
            personRes.status === 200
          ) {
            setAlertMessage("user updated successfully");
            setAlertSeverity("success");
            setAlertOpen(true);
          }
          console.log(updatedFile);
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
                    file: updatedFile?.data
                      ? updatedFile?.data
                      : updatedRow.file,
                    fileId,
                  }
                : row
            )
          );
          console.log({
            updatedRow: {
              ...updatedRow,
              address: updatedAddress ? updatedAddress : address,
              addressId: addressId,
              roleId: updatedRoleId,
              positionId: updatedPositionId,
              departmentId: updatedDepartmentId,
              bDate: updatedBdate,
              file: updatedFile?.data ? updatedFile?.data : updatedRow.file,
              fileId,
            },
          });
          return {
            ...updatedRow,
            address: updatedAddress ? updatedAddress : address,
            addressId: addressId,
            roleId: updatedRoleId,
            positionId: updatedPositionId,
            departmentId: updatedDepartmentId,
            bDate: updatedBdate,
            file: updatedFile?.data ? updatedFile?.data : updatedRow.file,
            fileId,
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
    },
    [
      action,
      address,
      addressId,
      departmentId,
      departmentOptions,
      fileId,
      handleFileUpload,
      newAddress?.city,
      newAddress?.district,
      newAddress?.state,
      newAddress?.village,
      newBdate,
      oldBdate,
      positionId,
      positionOptions,
      roleId,
      roleOptions,
      rows,
      updatedFile,
    ]
  );

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
      <DraggableDialog
        open={isDeleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
      />
      <ChangePasswordByAdminModal
        open={changePasswordModalOpen}
        handleClose={() => setChangePasswordModalOpen(false)}
        userId={selectedUserId}
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
            getRowId={(row) => row.userId} // Ensure the correct row ID is used
            disableColumnFilter
            disableColumnMenu
            slots={{
              toolbar: () => (
                <GridCustomToolbar
                  clearAllFilters={clearAllFilters}
                  rows={selectedRowsToExport}
                  navigateTo={"/create-new-user"}
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
}

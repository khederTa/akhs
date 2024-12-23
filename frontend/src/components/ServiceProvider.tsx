/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paper, Stack, TextField, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Loading } from "./Loading";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import axios from "../utils/axios";
import DraggableDialog from "./DraggableDialog";
import DownloadButton from "./DownloadButton";
import Address from "./Address";
import FileUpload from "./FileUpload";
import FilterHeader from "./FilterHeader";
import DateFilterHeader from "./DateFilterHeader";
import CustomDateRenderer from "./CustomDateRenderer";
import QAFilterHeader from "./QAFilterHeader";
import GenderFilterHeader from "./GenderFilterHeader";
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import { AntSwitch } from "./Volunteer";
import GridCustomToolbar from "./GridCustomToolbar";
import AlertNotification from "./AlertNotification";
import { useTranslation } from "react-i18next";
import OptionFilterHeader from "./OptionFilterHeader";
import ProviderPromoteModal from "./ProviderPromoteModal";

const ServiceProvider = () => {
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
  const [address, setAddress] = useState<number | null>(null);
  const [users, setUsers] = useState([]);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<number | any>(null);
  const [fileId, setFileId] = useState<number | null>(null);
  const [updatedFile, setUpdatedFile] = useState(null);
  const [departments, setDepartments] = useState<any>([{}]);
  const [positions, setPositions] = useState<any>([{}]);
  const apiRef = useGridApiRef();
  const paginationModel = { page: 0, pageSize: 5 };
  const [oldBdate, setOldBdate] = useState<any>(null);
  const [newBdate, setNewBdate] = useState<any>(null);
  const [promoteProviderOpen, setPromoteProviderOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null); // Store selected department ID
  const [positionId, setPositionId] = useState<number | null>(null); // Track selected position ID

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const handleAlertClose = useCallback(() => {
    setAlertOpen(false);
  }, []);
  const [uploadFileSizeError, setUploadFileSizeError] = useState("");
  // Open promote confirmation dialog
  const handleOpenPromoteDialog = useCallback((id: any) => {
    setSelectedRow(id);
    setPromoteProviderOpen(true);
  }, []);
  useEffect(() => {
    if (uploadFileSizeError.length > 0) {
      setAlertMessage(uploadFileSizeError);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  }, [uploadFileSizeError]);
  const { t } = useTranslation();
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
      const rowIndex = rows.findIndex((row: any) => row.providerId === id);
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
        await axios.put(`/volunteer/${volunteerId}`, {
          active_status: updatedActiveStatus,
        });

        // Update the rows state
        const updatedRows = [...rows];
        updatedRows[rowIndex] = updatedRow;
        setRows(updatedRows);

        // Update filteredRows if it includes the row
        const filteredRowIndex = filteredRows.findIndex(
          (row: any) => row.id === id
        );
        if (filteredRowIndex !== -1) {
          const updatedFilteredRows = [...filteredRows];
          updatedFilteredRows[filteredRowIndex] = updatedRow as never;
          setFilteredRows(updatedFilteredRows);
        }
      } catch (error) {
        console.error("Error updating active status:", error);
      }
    },
    [filteredRows, rows, setFilteredRows]
  );
  // Open delete confirmation dialog
  // const handleOpenDeleteDialog = useCallback((id: any) => {
  //   setSelectedRow(id);
  //   setIsDeleteDialogOpen(true);
  // }, []);
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

  // Save row updates
  const handleSave = useCallback(async (id: any) => {
    setAction("save");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  }, []);

  const handleEditClick = useCallback(
    (id: any) => {
      // console.log({ rows });
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
    },
    [apiRef, rows]
  );

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
      setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
    },
    [oldBdate]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "providerId",
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
        field: "bDate",
        headerName: "Birth Date",
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderCell: (params) => <CustomDateRenderer value={params.value} />,
        renderEditCell: (_params) => (
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
        renderEditCell: (_params) => <Address setAddressId={setAddressId} />,
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
              setUploadFileSizeError={setUploadFileSizeError}
            />
          );
        },
      },
      {
        field: "actions",
        headerName: t("actions"),
        type: "actions",
        width: 250,
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === "edit";
          const isUser = users.find(
            (user: { providerId: number }) => user.providerId === id
          )
            ? true
            : false;

          return [
            !isInEditMode && (
              <Tooltip title={t("edit")}>
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  onClick={() => handleEditClick(id)}
                />
              </Tooltip>
            ),
            !isInEditMode && !isUser && (
              <Tooltip title={t("promote")}>
                <GridActionsCellItem
                  icon={<PersonAddAlt1RoundedIcon />}
                  label="Promote"
                  onClick={() => handleOpenPromoteDialog(id)}
                />
              </Tooltip>
            ),
            // !isInEditMode && (
            //   <GridActionsCellItem
            //     icon={<DeleteIcon />}
            //     label="Delete"
            //     onClick={() => handleOpenDeleteDialog(id)}
            //   />
            // ),
            !isInEditMode && !isUser && (
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
                      rows.find((row) => row.providerId === id)
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
      rowModesModel,
      users,
      rows,
      handleEditClick,
      handleOpenPromoteDialog,
      handleToggleActive,
      handleSave,
      handleCancel,
    ]
  );
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get("/user");
        if (response.status === 200) {
          const userRows = response.data.map((user: any) => {
            return {
              providerId: user?.ServiceProvider?.providerId,
            };
          });
          setUsers(userRows);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchServiceProviders() {
      setIsLoading(true);
      try {
        const response = await axios.get("/serviceprovider");
        if (response && response.status === 200) {
          console.log(response.data);
          const enrichedData = response.data.map((provider: any) => ({
            providerId: provider.providerId,
            volunteerId: provider.Volunteer.volunteerId,
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
            active_status: provider.Volunteer?.active_status,
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
    fetchUserData();
  }, []);
  // Handle row edit

  // Close delete dialog
  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedRow(null);
  }, []);

  // Close delete dialog
  const handleClosePromoteDialog = useCallback(() => {
    setPromoteProviderOpen(false);
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

    // console.log("departments", departments);
    // console.log("positions", positions);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      // const row: any = rows.find((row: any) => row.providerId === selectedRow);

      await axios.delete(`/serviceprovider/${selectedRow}`);
      // Delete volunteer data
      // await axios.delete(`/volunteer/${row.volunteerId}`);
      // Delete associated person and address data
      // await axios.delete(`/person/${row.personId}`);
      //  await axios.delete(`/address/${row.addressId}`);
      setRows((prevRows) =>
        prevRows.filter((row: any) => row.providerId !== selectedRow)
      );
      setFilteredRows((prevRows) =>
        prevRows.filter((row: any) => row.providerId !== selectedRow)
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
  // console.log("deprtmrntID is ", departmentId);
  // console.log("positionID is ", positionId);
  // console.log("print oldBdate", oldBdate);
  // console.log("print newBdate", newBdate);
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
          const personResponse = await axios.put(`/person/${personId}`, {
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
          if (personResponse.status !== 200) {
            setAlertMessage("nationalNumber must be unique, please try again");
            setAlertSeverity("error");
            setAlertOpen(true);
            const oldRow: any = rows.find(
              (row: any) => row.userId === updatedRow.userId
            );

            if (updatedFile) {
              handleFileUpload(oldRow.file);
            }

            return oldRow;
          }
          const providerResponse = await axios.put(
            `/serviceprovider/${providerId}`,
            {
              positionId: updatedPositionId,
              departmentId: updatedDepartmentId,
            }
          );

          if (
            providerResponse.status === 200 &&
            personResponse.status === 200
          ) {
            setAlertMessage("service provider updated successfully");
            setAlertSeverity("success");
            setAlertOpen(true);
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
          }
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
          setAlertMessage("nationalNumber must be unique, please try again");
          setAlertSeverity("error");
          setAlertOpen(true);
          const oldRow: any = rows.find(
            (row: any) => row.userId === updatedRow.userId
          );

          if (updatedFile) {
            handleFileUpload(oldRow.file);
          }

          return oldRow;
        }
      } else if (action === "cancel") {
        const oldRow: any = rows.find(
          (row: any) => row.providerId === updatedRow.providerId
        );
        // console.log({ oldRow });
        // console.log({ updatedRow });
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
      rows,
      updatedFile,
    ]
  );

  const handlePromote = useCallback(
    async (data: any) => {
      try {
        const response = await axios.post("/user/promote/", {
          ...data,
          providerId: selectedRow,
        });
        if (response.status === 201) {
          console.log({ selectedRow });
          setRows((prevRows) =>
            prevRows.filter((row: any) => row.providerId !== selectedRow)
          );
          setAlertMessage(t("provider has promoted to a user"));
          setAlertSeverity("success");
        }
      } catch (error) {
        setAlertMessage(t("failed to promote volunteer"));
        setAlertSeverity("error");
      } finally {
        setAlertOpen(true);
      }
    },
    [selectedRow, t]
  );

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<any>({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsToExport, setSelectedRowsToExport] = useState<any>([]);
  const [selectedRowsIds, setSelectedRowsIds] = useState<any[]>([]);
  const handleSelectionChange = (newSelection: any[]) => {
    const newSelectedRows: any = newSelection.map((selected) => {
      return rows.find((row: any) => row.providerId === selected);
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
      {alertOpen && (
  <AlertNotification
    open={alertOpen}
    message={alertMessage}
    severity={alertSeverity}
    onClose={handleAlertClose}
  />
)}

      <DraggableDialog
        open={isDeleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
      />
      <ProviderPromoteModal
        open={promoteProviderOpen}
        handleClose={handleClosePromoteDialog}
        onSubmit={handlePromote}
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
            getRowId={(row) => row.providerId} // Ensure the correct row ID is used
            disableColumnFilter
            disableColumnMenu
            slots={{
              toolbar: () => (
                <GridCustomToolbar
                  clearAllFilters={clearAllFilters}
                  rows={selectedRowsToExport}
                  navigateTo={"/serviceprovider-information"}
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

export default ServiceProvider;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, debounce, Paper, Stack, styled, Switch } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
  GridToolbarContainerProps,
  useGridRootProps,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { Loading } from "./Loading";
import {
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { useTranslation } from "react-i18next";
import FilterHeader from "./FilterHeader";
import AlertNotification from "./AlertNotification";
import { ReportModal } from "./ReportModal";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DateFilterHeader from "./DateFilterHeader";
import CustomDateRenderer from "./CustomDateRenderer";
import QAFilterHeader from "./QAFilterHeader";
import GenderFilterHeader from "./GenderFilterHeader";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import GridCustomToolbar from "./GridCustomToolbar";

// Define types for date filtering
type Operator = "equals" | "before" | "after" | "between";

const AntSwitch = styled(Switch)(({ theme }: any) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#1890ff",
        ...theme.applyStyles("dark", {
          backgroundColor: "#177ddc",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "rgba(0,0,0,.25)",
    boxSizing: "border-box",
    ...theme.applyStyles("dark", {
      backgroundColor: "rgba(255,255,255,.35)",
    }),
  },
}));

type DateFilterValue = {
  value: string;
  operator: "equals" | "before" | "after" | "between";
  endDate?: string;
};

type FilterModel = {
  [key: string]: string | DateFilterValue; // Supports both string and DateFilterValue
};

const Volunteer = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [address, setAddress] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<any | null>(null);
  const [fileId, setFileId] = useState<number | null>(null);
  const [updatedFile, setUpdatedFile] = useState<any | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  const [oldFile, setOldFile] = useState<any | null>(null);
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const paginationModel = { page: 0, pageSize: 5 };
  const { t } = useTranslation();
  const [filterModel, setFilterModel] = useState<FilterModel>({
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
    compSkills: "",
    koboSkils: "",
    prevVol: "",
    smoking: "",
    bDate: { value: "", operator: "equals", endDate: "" }, // Example date filter
  });
  const [filterVisibility, setFilterVisibility] = useState<{
    [key: string]: boolean;
  }>({
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
    compSkills: false,
    koboSkils: false,
    prevVol: false,
    smoking: false,
  });

  const [filteredRows, setFilteredRows] = useState<any[]>([]); // Assuming `rows` is your data
  const [sortModel, setSortModel] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "",
    direction: "asc",
  });

  // Debounced update filtered rows
  const updateFilteredRows = useCallback(() => {
    const filtered = rows.filter((row) => {
      return Object.entries(filterModel).every(([field, value]) => {
        if (typeof value === "string") {
          // Handle string-based filters
          if (value) {
            const cellValue = row[field]?.toString().toLowerCase() || "";
            const filterValue = value.toLowerCase();
            return field === "gender"
              ? cellValue === filterValue
              : cellValue.includes(filterValue);
          }
          return true;
        } else if (value && typeof value === "object") {
          // Handle date-based filters
          const { value: filterValue, operator, endDate } = value;
          if (!filterValue) return true; // Skip filtering if no date value

          const rowDate = new Date(row[field]);
          const filterDate = new Date(filterValue);
          const endDateValue = endDate ? new Date(endDate) : undefined;

          switch (operator) {
            case "equals":
              return rowDate.toDateString() === filterDate.toDateString();
            case "before":
              return rowDate < filterDate;
            case "after":
              return rowDate > filterDate;
            case "between":
              return endDateValue
                ? rowDate >= filterDate && rowDate <= endDateValue
                : false;
            default:
              return true;
          }
        }
        return true; // No filter or unsupported filter
      });
    });
    setFilteredRows(filtered);
  }, [filterModel, rows, setFilteredRows]);

  useEffect(() => {
    updateFilteredRows();
  }, [filterModel, updateFilteredRows]);

  // Handle filter change for text fields
  const handleTextFilterChange = useCallback((field: string, value: string) => {
    setFilterModel((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handle filter change for date fields
  const handleDateFilterChange = useCallback(
    (
      field: string,
      value: string,
      operator: "equals" | "before" | "after" | "between",
      endDate?: string
    ) => {
      setFilterModel((prev) => ({
        ...prev,
        [field]: { value, operator, endDate },
      }));
    },
    []
  );

  // Handle reset filter
  const clearFilter = useCallback((field: string) => {
    setFilterModel((prev) => ({
      ...prev,
      [field]:
        field === "bDate" ? { value: "", operator: "equals", endDate: "" } : "",
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterModel({
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
      compSkills: "",
      koboSkils: "",
      prevVol: "",
      smoking: "",
      bDate: { value: "", operator: "equals", endDate: "" }, // Example date filter
    });
  }, []);

  // Sort logic
  const handleSortClick = useCallback(
    (field: string) => {
      const isAsc = sortModel.field === field && sortModel.direction === "asc";
      const direction = isAsc ? "desc" : "asc";
      setSortModel({ field, direction });

      const sortedRows = [...filteredRows].sort((a, b) => {
        if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
        if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setFilteredRows(sortedRows);
    },
    [sortModel.field, sortModel.direction, filteredRows, setFilteredRows]
  );

  // active / inactive volunteer
  const handleToggleActive = useCallback(
    async (id: number) => {
      const rowIndex = rows.findIndex((row) => row.id === id);
      if (rowIndex === -1) return;

      // Toggle active_status
      const updatedActiveStatus =
        rows[rowIndex].active_status === "active" ? "inactive" : "active";
      const updatedRow = {
        ...rows[rowIndex],
        active_status: updatedActiveStatus,
      };
      console.log(updatedRow);
      try {
        // Update the backend
        await axios.put(`/volunteer/${id}`, {
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
    [filteredRows, rows]
  );

  // Handle row edit
  const handleEditClick = useCallback(
    (id: any) => {
      console.log({ rows });
      const currentRow: any = rows.find((row: any) => row.volunteerId === id);
      // setOldRow(currentRow);
      setFileId(currentRow.fileId);
      setAddressId(currentRow.addressId);
      setAddress(currentRow.address);
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
  const handleCancel = useCallback((id: any) => {
    setAction("cancel");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  }, []);

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = useCallback((id: any) => {
    setRowToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);

  // Memoized columns definition to prevent re-rendering
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "volunteerId",
        headerName: t("id"),
        minWidth: 100,
        sortable: true,
        editable: false,
      },
      // {
      //   field: "active_status",
      //   headerName: "Active_status",
      //   width: 100,
      //   editable: true,
      //   type: "boolean",
      // },

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
        field: "momName",
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
        field: "bDate",
        headerName: "Birth Date",
        minWidth: 200,
        sortable: false,
        hideSortIcons: true,
        editable: true,
        renderCell: (params) => <CustomDateRenderer value={params.value} />,
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
        minWidth: 300,
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
        headerName: t("actions"),
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
            !isInEditMode && (
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
                    rows.find((row) => row.id === id).active_status === "active"
                  }
                  inputProps={{ "aria-label": "ant design" }}
                  onChange={() => handleToggleActive(id as number)}
                />
              </Stack>
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
    [
      clearFilter,
      filterModel,
      filterVisibility,
      handleCancel,
      handleDateFilterChange,
      handleEditClick,
      handleOpenDeleteDialog,
      handleSave,
      handleSortClick,
      handleTextFilterChange,
      handleToggleActive,
      rowModesModel,
      rows,
      sortModel,
      t,
    ]
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
          // setFilteredRows(enrichedData);
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

  // Close delete dialog
  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setRowToDelete(null);
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

  const handleDelete = useCallback(async () => {
    try {
      // Retrieve personId and addressId from the row to delete
      const row: any = rows.find((row: any) => row.volunteerId === rowToDelete);

      // Delete volunteer data
      await axios.delete(`/volunteer/${rowToDelete}`);

      // Delete associated person and address data
      await axios.delete(`/person/${row.personId}`);
      await axios.delete(`/address/${row.addressId}`);

      // Update the rows state after deletion
      setRows((prevRows) =>
        prevRows.filter((row: any) => row.volunteerId !== rowToDelete)
      );
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting volunteer and related data:", error);
    }
  }, [handleCloseDeleteDialog, rowToDelete, rows]);

  const handleFileUpload = useCallback(
    async (base64FileData: string) => {
      const response = await axios.put(`file/${fileId}`, {
        fileData: base64FileData,
      });
    },
    [fileId]
  );

  const deleteFile = useCallback(
    async (id: number, clearFile: boolean = true) => {
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
    },
    []
  );
  // Process row update for Volunteer, Person, and Address data
  const processRowUpdate = useCallback(
    async (updatedRow: any) => {
      if (action === "save") {
        try {
          const updatedAddress = `${newAddress?.state?.split("/")[1] || ""} - ${
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
          const volunteerResponse = await axios.put(
            `/volunteer/${volunteerId}`,
            {
              active_status,
            }
          );

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

          // Update address data
          // const addressResponse = await axios.put(`/address/${addressId}`, {
          //   state,
          //   city,
          //   district,
          //   village,
          // });

          if (
            volunteerResponse.status === 200 &&
            personResponse.status === 200
            /*&&
          addressResponse.status === 200*/
          ) {
            setAlertMessage("volunteer updated successfully");
            setAlertSeverity("success");

            setRows((prevRows: any) =>
              prevRows.map((row: any) => {
                console.log(row);
                return row.volunteerId === volunteerId
                  ? {
                      ...updatedRow,
                      file: updatedFile ? updatedFile : updatedRow.file,
                      File: updatedFile
                        ? {
                            id: fileId,
                            file: updatedFile,
                          }
                        : updatedRow.File,
                      address: updatedAddress ? updatedAddress : address,
                      addressId: addressId,
                    }
                  : row;
              })
            );
            // setFilteredRows((prevRows: any) =>
            //   prevRows.map((row: any) => {
            //     console.log(row);
            //     return row.volunteerId === volunteerId
            //       ? {
            //           ...updatedRow,
            //           file: updatedFile ? updatedFile : updatedRow.file,
            //           File: updatedFile
            //             ? {
            //                 id: fileId,
            //                 file: updatedFile,
            //               }
            //             : updatedRow.File,
            //           address: updatedAddress ? updatedAddress : address,
            //           addressId: addressId,
            //         }
            //       : row;
            //   })
            // );

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
            };
          } else {
            setAlertMessage("failed to update volunteer");
            setAlertSeverity("error");
          }
        } catch (error) {
          console.error("Error updating row:", error);
          setAlertMessage("failed to update volunteer");
          setAlertSeverity("error");
        } finally {
          setAlertOpen(true);
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
        // if (oldRow && oldRow?.file?.lenngth > 0 && updatedFile) {
        //   handleFileUpload(oldRow.file);
        // } else if (updatedFile) {
        //   console.log({ updatedFile });
        //   deleteFile(oldRow.fileId, true);
        // }
        // setRows((prevRows: any) =>
        //   prevRows.map((row: any) =>
        //     row.volunteerId === updatedRow.volunteerId ? { oldRow } : row
        //   )
        // );
        return oldRow;
      }
    },
    [
      action,
      address,
      addressId,
      fileId,
      handleFileUpload,
      newAddress?.city,
      newAddress?.district,
      newAddress?.state,
      newAddress?.village,
      rows,
      updatedFile,
    ]
  );

  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (newSelection: any[]) => {
    const newSelectedRows = newSelection.map((selected) => {
      return filteredRows.find((row) => row.id === selected);
    });
    setSelectedRows(newSelectedRows)
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
      <DraggableDialog
        open={isDeleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
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
                  navigateTo={"/volunteer-information"}
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

export default Volunteer;

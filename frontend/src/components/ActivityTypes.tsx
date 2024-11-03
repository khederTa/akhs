import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  useGridApiRef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridRenderEditCellParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Button,
  Stack,
  Chip,
  Box,
  Autocomplete,
  TextField,
  Switch,
} from "@mui/material";
import axios from "../utils/axios";
import { Loading } from "./Loading";
import { ReportModal } from "./ReportModal";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
const paginationModel = { page: 0, pageSize: 5 };

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

export function ActivityTypes() {
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  // const [oldRow, setOldRow] = useState({});
  const [action, setAction] = useState("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const apiRef = useGridApiRef();
  const navigate = useNavigate();

  const handleEditClick = (id: any) => {
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "edit" } }));
    apiRef.current.setCellFocus(id, "name"); // Focus on the row's 'name' cell
  };

  const handleSave = async (id: any) => {
    setAction("save");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  };

  const handleCancel = (id: any) => {
    setAction("cancel");
    setRowModesModel((prev: any) => ({ ...prev, [id]: { mode: "view" } }));
  };

  useEffect(() => {
    const fetchActivityTypes = async () => {
      setIsLoading(true);
      try {
        const { data, status } = await axios.get("/activityType");
        if (status === 200) {
          const adjustedData = data.map((activityType: any) => ({
            ...activityType,
            prerequisites: activityType.Prerequisites,
            department: activityType.Department?.name,
          }));
          setRows(adjustedData);
          setActivityTypes(adjustedData);
        } else {
          console.error("Unexpected response:", status);
        }
      } catch (error) {
        console.error("Error fetching activity types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get("/department");
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchActivityTypes();
    fetchDepartments();
  }, []);

  // Process row update (for inline editing)
  // const handleProcessRowUpdate = async (newRow: GridRowModel) => {
  //   try {
  //     console.log(newRow);
  //     const departmentId = departments.filter(
  //       (department) => department.name === newRow.department
  //     )[0].id;
  //     const updatedRow = {
  //       ...newRow,
  //       prerequisites: newRow.prerequisites.map((pre: any) => pre.id), // Convert prerequisites to IDs
  //       departmentId,
  //     };

  //     const response = await axios.put(
  //       `/activityType/${newRow.id}`,
  //       updatedRow
  //     );
  //     if (response.status === 200) {
  //       console.log("Row updated successfully:", newRow);
  //       return newRow;
  //     } else {
  //       throw new Error("Failed to update row");
  //     }
  //   } catch (error) {
  //     console.error("Error updating row:", error);
  //     throw error;
  //   }
  // };

  // active / inactive an activity type
  const handleToggleActive = async (id: number) => {
    const row = rows.find((row) => row.id === id);
    const active_status =
      row.active_status === "active" ? "inactive" : "active";
    if (!id) return;
    try {
      const updatedRow = { ...row, active_status };
      console.log(updatedRow);
      await axios.put(`/activityType/${id}`, updatedRow);
    } catch (error) {
      console.error("Error active / inactive row:", error);
    }
  };

  const DepartmentEditor = (params: GridRenderEditCellParams) => {
    const handleChange = (_event: any, newValue: any) => {
      console.log(newValue);
      params.api.setEditCellValue({
        id: params.row.id,
        field: "department",
        value: newValue?.name || "",
      });
    };

    return (
      <Autocomplete
        id="department-editor"
        sx={{ width: "100%" }}
        options={departments}
        getOptionLabel={(option: { name: any }) => option.name}
        value={departments.find((dep) => dep.name === params.value) || null}
        onChange={handleChange}
        renderInput={(params: any) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Select Department"
          />
        )}
      />
    );
  };
  // Custom cell editor component for prerequisites column using Autocomplete
  const PrerequisiteEditor = (params: GridRenderEditCellParams) => {
    const [selectedPrerequisites, setSelectedPrerequisites] = useState<any[]>(
      params.value || []
    );

    // Filter out the current activity itself from the available options
    const availablePrerequisites = activityTypes.filter(
      (activity) => activity.id !== params.row.id
    );

    const handleChange = (_event: any, newValue: any[]) => {
      setSelectedPrerequisites(newValue);
      params.api.setEditCellValue({
        id: params.row.id,
        field: "prerequisites",
        value: newValue,
      });
    };

    return (
      <Autocomplete
        multiple
        id="tags-filled"
        sx={{
          width: "100%",
        }}
        options={availablePrerequisites}
        getOptionLabel={(option: { name: any }) => option.name}
        value={selectedPrerequisites}
        onChange={handleChange}
        isOptionEqualToValue={(option: any, value: any) =>
          option.id === value.id
        }
        renderInput={(params: any) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Select prerequisites"
            sx={{
              minHeight: "53px !important",
            }}
          />
        )}
        renderTags={(
          value: any[],
          getTagProps: (arg0: { index: number }) => any
        ) =>
          value.map((option: any, index: number) => (
            <Chip label={option.name} {...getTagProps({ index })} />
          ))
        }
      />
    );
  };

  // Custom renderer for displaying prerequisites as chips
  const PrerequisiteRenderer = (params: GridRenderCellParams) => {
    const selectedPrerequisites = params.value || [];
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
        {selectedPrerequisites.map((prerequisite: any) => (
          <Chip key={prerequisite.id} label={prerequisite.name} size="small" />
        ))}
      </Box>
    );
  };

  const columns: any[] = [
    { field: "id", headerName: "ID", minWidth: 150, editable: false },
    { field: "name", headerName: "Name", minWidth: 150, editable: true },
    {
      field: "prerequisites",
      headerName: "Prerequisites",
      minWidth: 200,
      editable: true, // Enable editing for this column
      renderEditCell: (params: any) => <PrerequisiteEditor {...params} />, // Custom editor
      renderCell: (params: any) => <PrerequisiteRenderer {...params} />, // Custom renderer for display
    },
    {
      field: "department",
      headerName: "Department",
      minWidth: 250,
      editable: true,
      renderEditCell: (params: any) => <DepartmentEditor {...params} />,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 250,
      editable: true,
    },
    ,
    // {
    //   field: "active_status",
    //   headerName: "Active / Inactive",
    //   minWidth: 150,
    //   renderCell: (params: any) => (
    //     <Stack
    //       spacing={1}
    //       sx={{
    //         display: "flex",
    //         height: "100%",
    //         justifyContent: "center",
    //       }}
    //     >
    //       <AntSwitch
    //         defaultChecked={params.value === "active"}
    //         inputProps={{ "aria-label": "ant design" }}
    //         onChange={() => handleToggleActive(params.row)}
    //       />
    //     </Stack>
    //   ),
    // },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params: any) => {
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
                  rows.find((row) => row.id === params.id).active_status ===
                  "active"
                }
                inputProps={{ "aria-label": "ant design" }}
                onChange={() => handleToggleActive(params.id)}
              />
            </Stack>
          ),
          isInEditMode && (
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={() => {
                handleSave(params.id);
              }}
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
        ].filter(Boolean) as React.ReactElement[]; // Ensure only elements remain in the array
      },
    },
  ];
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <>
        <Button type="button" onClick={() => navigate("/new-activity-type")}>
          <AddOutlinedIcon />
          Add
        </Button>
      </>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <>
        <Button onClick={() => setReportModalIsOpen(true)}>
          <FileDownloadOutlinedIcon />
          Export
        </Button>
      </>
    </GridToolbarContainer>
  );

  const processRowUpdate = async (newRow: any) => {
    if (action === "save") {
      try {
        const departmentId = departments.filter(
          (department) => department.name === newRow.department
        )[0].id;
        console.log(newRow);
        const updatedRow = {
          ...newRow,
          prerequisites: newRow.prerequisites,
          departmentId,
        };
        const updatedRowToPost = {
          ...newRow,
          prerequisites: newRow.prerequisites.map((pre: any) => pre.id), // Convert prerequisites to IDs
          departmentId,
        };

        const response = await axios.put(
          `/activityType/${newRow.id}`,
          updatedRowToPost
        );
        if (response.status === 200) {
          console.log("Row updated successfully:", newRow);
          setRows((prevRows: any) =>
            prevRows.map((row: any) =>
              row.id === newRow.id ? updatedRow : row
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
      const oldRow = rows.find((row) => row.id === newRow.id);
      // setRows((prevRows: any) =>
      //   prevRows.map((row: any) => (row.id === newRow.id ? oldRow : row))
      // );
      return oldRow;
    }
  };

  return (
    <>
      <ReportModal
        open={reportModalIsOpen}
        handleClose={() => setReportModalIsOpen(false)}
        setReportName={setReportName}
        reportName={reportName}
        rows={rows}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            // processRowUpdate={handleProcessRowUpdate}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            getRowId={(row) => row.id} // Ensure the correct row ID is used
            disableColumnFilter
            disableColumnMenu
            slots={{ toolbar: CustomToolbar }}
            editMode="row"
            rowModesModel={rowModesModel}
            processRowUpdate={processRowUpdate}
            apiRef={apiRef}
          />
        </Paper>
      )}
    </>
  );
}

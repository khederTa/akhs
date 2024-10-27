import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRenderCellParams,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
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

  const navigate = useNavigate();

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
  const handleProcessRowUpdate = async (newRow: GridRowModel) => {
    try {
      console.log(newRow);
      const departmentId = departments.filter(
        (department) => department.name === newRow.department
      )[0].id;
      const updatedRow = {
        ...newRow,
        prerequisites: newRow.prerequisites.map((pre: any) => pre.id), // Convert prerequisites to IDs
        departmentId,
      };

      const response = await axios.put(
        `/activityType/${newRow.id}`,
        updatedRow
      );
      if (response.status === 200) {
        console.log("Row updated successfully:", newRow);
        return newRow;
      } else {
        throw new Error("Failed to update row");
      }
    } catch (error) {
      console.error("Error updating row:", error);
      throw error;
    }
  };

  // active / inactive an activity type
  const handleToggleActive = async (row: any) => {
    const id = row.id;
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
    const handleChange = (event: any, newValue: any) => {
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
        getOptionLabel={(option) => option.name}
        value={departments.find((dep) => dep.name === params.value) || null}
        onChange={handleChange}
        renderInput={(params) => (
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

    const handleChange = (event: any, newValue: any[]) => {
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
        getOptionLabel={(option) => option.name}
        value={selectedPrerequisites}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Select prerequisites"
            sx={{
              minHeight: "53px !important",
            }}
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

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 150, editable: false },
    { field: "name", headerName: "Name", minWidth: 150, editable: true },
    {
      field: "prerequisites",
      headerName: "Prerequisites",
      minWidth: 200,
      editable: true, // Enable editing for this column
      renderEditCell: (params) => <PrerequisiteEditor {...params} />, // Custom editor
      renderCell: (params) => <PrerequisiteRenderer {...params} />, // Custom renderer for display
    },
    {
      field: "department",
      headerName: "Department",
      minWidth: 250,
      editable: true,
      renderEditCell: (params) => <DepartmentEditor {...params} />,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 250,
      editable: true,
    },
    {
      field: "active_status",
      headerName: "Active / Inactive",
      minWidth: 150,
      renderCell: (params: any) => (
        <Stack
          spacing={1}
          sx={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <AntSwitch
            defaultChecked={params.value === "active"}
            inputProps={{ "aria-label": "ant design" }}
            onChange={() => handleToggleActive(params.row)}
          />
        </Stack>
      ),
    },
  ];

  return (
    <>
      <ReportModal
        open={reportModalIsOpen}
        handleClose={() => setReportModalIsOpen(false)}
        setReportName={setReportName}
        reportName={reportName}
        rows={rows}
      />
      <Stack direction="row" justifyContent={"flex-start"} sx={{ gap: 1 }}>
        <Button
          type="button"
          variant="contained"
          onClick={() => navigate("/new-activity-type")}
        >
          Add New Activity Type
        </Button>
        <Button variant="outlined" onClick={() => setReportModalIsOpen(true)}>
          Export Report
        </Button>
      </Stack>

      {isLoading ? (
        <Loading />
      ) : (
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            processRowUpdate={handleProcessRowUpdate}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            getRowId={(row) => row.id} // Ensure the correct row ID is used
          />
        </Paper>
      )}
    </>
  );
}

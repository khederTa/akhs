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
  IconButton,
  Stack,
  Chip,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import axios from "../utils/axios";
import { Loading } from "./Loading";
import { ReportModal } from "./ReportModal";
import { useNavigate } from "react-router-dom";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DraggableDialog from "./DraggableDialog";
const paginationModel = { page: 0, pageSize: 5 };

export function ActivityTypes() {
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [activityTypeId, setActivityTypeId] = useState<number>();
  const [openDraggableDialog, setOpenDraggableDialog] = useState(false);

  const handleClickOpenDraggableDialog = (id: number) => {
    setActivityTypeId(id);
    setOpenDraggableDialog(true);
  };

  const handleCloseDraggableDialog = () => {
    setOpenDraggableDialog(false);
  };
  const navigate = useNavigate();

  // Fetch ActivityTypes from the backend
  useEffect(() => {
    async function fetchActivityTypes() {
      setIsLoading(true);
      try {
        const response = await axios.get("/activityType");
        if (response && response.status === 200) {
          // Map over the data to adjust the field names
          const adjustedData = response.data.map((activityType: any) => ({
            ...activityType,
            prerequisites: activityType.Prerequisites, // Rename 'Prerequisites' to 'prerequisites'
          }));

          setRows(adjustedData);
          setActivityTypes(adjustedData); // Save all activity types for the dropdown
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Error fetching activity types:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchActivityTypes();
  }, []);

  // Process row update (for inline editing)
  const handleProcessRowUpdate = async (newRow: GridRowModel) => {
    try {
      const updatedRow = {
        ...newRow,
        prerequisites: newRow.prerequisites.map((pre: any) => pre.id), // Convert prerequisites to IDs
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

  // Delete an activity type
  const handleDelete = async (id: number) => {
    if (!id) return;
    try {
      await axios.delete(`/activityType/${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      console.log("Row deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
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
            <Chip
              label={option.name}
              {...getTagProps({ index })}
            />
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
      field: "description",
      headerName: "Description",
      minWidth: 250,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      renderCell: (params: any) => (
        <IconButton onClick={() => handleClickOpenDraggableDialog(params.id)}>
          <DeleteRoundedIcon color="error" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <DraggableDialog
        open={openDraggableDialog}
        handleClose={handleCloseDraggableDialog}
        onConfirm={() => handleDelete(activityTypeId as number)}
      />
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

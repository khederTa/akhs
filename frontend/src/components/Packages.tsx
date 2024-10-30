import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridRowModel,
} from "@mui/x-data-grid";
import { Loading } from "./Loading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { Description } from "@mui/icons-material";

export function Packages() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [packageResponse, activityTypeResponse] = await Promise.all([
          axios.get("/package"),
          axios.get("/activityType"),
        ]);

        if (packageResponse.status === 200) {
          const adjustedData = packageResponse.data.map((packageRow: any) => ({
            ...packageRow,
            activityTypes: packageRow.ActivityTypes,
          }));
          setRows(adjustedData);
          setPackages(adjustedData);
        } else {
          console.error("Unexpected package response:", packageResponse.status);
        }

        if (activityTypeResponse.status === 200) {
          setActivityTypes(activityTypeResponse.data);
        } else {
          console.error(
            "Unexpected activityType response:",
            activityTypeResponse.status
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const paginationModel = { page: 0, pageSize: 5 };

  const ActivityTypeEditor = (params: GridRenderEditCellParams) => {
    const [selectedActivityTypes, setSelectedActivityTypes] = useState<any[]>(
      params.value || []
    );

    const handleChange = (event: any, newValue: any[]) => {
      setSelectedActivityTypes(newValue);
      try {
        params.api.setEditCellValue({
          id: params.row.id,
          field: "activityTypes",
          value: newValue,
        });
      } catch (error) {
        console.error("Error updating cell value:", error);
      }
    };

    return (
      <Autocomplete
        multiple
        id="tags-filled"
        sx={{ width: "100%" }}
        options={activityTypes}
        getOptionLabel={(option) => option.name}
        value={selectedActivityTypes}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Select activity type"
            sx={{ minHeight: "53px !important" }}
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

  const handleProcessRowUpdate = async (newRow: GridRowModel) => {
    try {
      console.log(newRow);
      const payload = {
        id: newRow.id,
        name: newRow.name,
        description: newRow.description,
        activityTypeIds: newRow.activityTypes.map(
          (activityType: any) => activityType.id
        ),
      };
      // Update API logic here as needed
      const response = await axios.put(`/package/${newRow.id}`, payload);
      if (response.status === 200) {
        setRows((prevRows: any) =>
          prevRows.map((row: any) =>
            row.id === newRow.id ? { ...newRow } : row
          )
        );
        console.log("Row updated successfully:", payload);
        return payload;
      } else {
        throw new Error("Failed to update row");
      }
    } catch (error) {
      console.error("Error updating row:", error);
      throw error;
    }
  };

  const ActivityTypeRenderer = (params: GridRenderCellParams) => {
    const selectedActivityTypes = params.value || [];
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
        {selectedActivityTypes.map((activityType: any) => (
          <Chip key={activityType.id} label={activityType.name} size="small" />
        ))}
      </Box>
    );
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "activityTypes",
      headerName: "Activity Types",
      minWidth: 200,
      editable: true,
      renderEditCell: (params) => <ActivityTypeEditor {...params} />,
      renderCell: (params) => <ActivityTypeRenderer {...params} />,
    },
  ];

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Stack direction="row" justifyContent="flex-start" sx={{ gap: 1 }}>
        <Button
          type="button"
          variant="contained"
          onClick={() => navigate("/new-package")}
        >
          Add New Package
        </Button>
      </Stack>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}

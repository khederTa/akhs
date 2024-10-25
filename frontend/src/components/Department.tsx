import { Button, Paper, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Loading } from "./Loading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const Department = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const paginationModel = { page: 0, pageSize: 5 };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
    },
  ];

  // Fetch Package from the backend
  useEffect(() => {
    async function fetchDepartment() {
      setIsLoading(true);
      try {
        const response = await axios.get("/department");
        if (response && response.status === 200) {
          // Map over the data to adjust the field names
          setRows(response.data)          

          // setActivityTypes(adjustedData); // Save all activity types for the dropdown
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Error fetching Department:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDepartment();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <Stack direction="row" justifyContent={"flex-start"} sx={{ gap: 1 }}>
        <Button
          type="button"
          variant="contained"
          onClick={() => navigate("/new-department")}
        >
          Add New Department
        </Button>
      </Stack>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          // checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}

export default Department
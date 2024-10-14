import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "./Loading";
import { ReportModal } from "./ReportModal";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", minWidth: 150 },
  { field: "name", headerName: "Name", minWidth: 150 },
  { field: "description", headerName: "Description", minWidth: 150 },
];

const paginationModel = { page: 0, pageSize: 5 };
export function ActivityTypes() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(rows);
  }, [rows]);

  useEffect(() => {
    async function fetchActivityTypes() {
      await axios
        .get("/activityType")
        .then((res) => setRows(res.data))
        .catch((error) => console.error(error));
    }
    fetchActivityTypes();
  }, []);

  const handleProcessRowUpdate = async (newRow: GridRowModel) => {
    try {
      // const response = await axios.post(`/user/${newRow.id}`, newRow);
      console.log("Row updated successfully:", newRow);
      return newRow;
    } catch (error) {
      console.error("Error updating row:", error);
      throw error;
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
            // checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>
      )}
    </>
  );
}

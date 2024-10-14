import { Button, Paper, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Loading } from "./Loading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Packages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const paginationModel = { page: 0, pageSize: 5 };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "done", headerName: "Done", width: 200 ,
          // Mapping TINYINT(1) value (0 or 1) to a user-friendly display (Done/Not Done)
      renderCell: (params) => (params?.value === true ? "Done" : "Not Done"),
     },
  ];

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Stack direction="row" justifyContent={"flex-start"} sx={{ gap: 1 }}>
        <Button
          type="button"
          variant="contained"
          onClick={() => navigate("/new-activity-type")}
        >
          Add New Activity Type
        </Button>
      </Stack>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}

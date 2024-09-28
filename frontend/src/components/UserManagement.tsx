import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";
import * as XLSX from "xlsx"; // Import xlsx
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { Loading } from "./Loading";
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", minWidth: 150 },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
    minWidth: 150,
  },
  { field: "firstName", headerName: "First name", minWidth: 150 },
  { field: "middleName", headerName: "Middle name", minWidth: 150 },
  { field: "lastName", headerName: "Last name", minWidth: 150 },
  { field: "email", headerName: "Email", minWidth: 150 },
  { field: "phone", headerName: "Phone", minWidth: 150 },
  { field: "position", headerName: "Position", minWidth: 150 },
  { field: "study", headerName: "Study", minWidth: 150 },
  { field: "work", headerName: "Work", minWidth: 150 },
  { field: "gender", headerName: "Gender", minWidth: 150 },
  {
    field: "birthDate",
    headerName: "Birth Date",
    minWidth: 150,
  },
  { field: "roleName", headerName: "Role Name", minWidth: 150 },
  {
    field: "roletDescription",
    headerName: "Role Description",
    minWidth: 150,
    width: 300,
  },
  { field: "departmentName", headerName: "Department Name", minWidth: 150 },
  {
    field: "departmentDescription",
    headerName: "Department Description",
    minWidth: 150,
    width: 300,
  },
];

const paginationModel = { page: 0, pageSize: 5 };
export function UserManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      const userData = await axios
        .get("/users")
        .then((res) => {
          const userRows = res.data.map((user: any) => {
            return {
              id: user?.userId,
              firstName: user?.Person?.fname,
              middleName: user?.Person?.mname,
              lastName: user?.Person?.lname,
              email: user?.Person?.email,
              phone: user?.Person?.phone,
              position: user?.position,
              study: user?.Person?.study,
              work: user?.Person?.work,
              gender: user?.Person?.gender,
              birthDate: user?.Person?.bDate,
              roleName: user?.Role?.name,
              roleDescription: user?.Role?.description,
              departmentName: user?.Department?.name,
              departmentDescription: user?.Department?.description,
            };
          });
          setLoading(false);
          setRows(userRows);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        });
      return userData;
    }

    const users = fetchUserData();
    console.log(users);
  }, []);

  const exportToExcel = () => {
    console.log("exporting...");
    const worksheet = XLSX.utils.json_to_sheet(rows); // Convert rows to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users"); // Append the worksheet to the workbook
    XLSX.writeFile(workbook, "Users_Report.xlsx"); // Write the workbook to a file
    console.log("Done!");
  };

  return (
    <>
      <Stack direction="row" justifyContent={"flex-start"} sx={{ gap: 1 }}>
        <Button
          type="button"
          variant="contained"
          onClick={() => navigate("/create-new-user")}
        >
          Add New User
        </Button>
        <Button variant="outlined" onClick={exportToExcel}>
          Export Excel
        </Button>
      </Stack>

      {loading ? (
        <Loading />
      ) : (
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
      )}
    </>
  );
}

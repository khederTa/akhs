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
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
    // renderCell: (params: any) => (
    //   <Link to={`${params.row.id}`}>{params.value}</Link>
    // ),
    minWidth: 150,
  },
  {
    field: "firstName",
    headerName: "First name",
    minWidth: 150,
    editable: true,
  },
  { field: "middleName", headerName: "Middle name", minWidth: 150 },
  { field: "lastName", headerName: "Last name", minWidth: 150 },
  { field: "email", headerName: "Email", minWidth: 150 },
  { field: "phone", headerName: "Phone", minWidth: 150 },
  { field: "position", headerName: "Position", minWidth: 150 },
  { field: "study", headerName: "Study", minWidth: 150 },
  { field: "city", headerName: "City", minWidth: 150 },
  { field: "street", headerName: "Street", minWidth: 150 },
  { field: "work", headerName: "Work", minWidth: 150 },
  {
    field: "gender",
    headerName: "Gender",
    minWidth: 150,
    editable: true,
    type: "singleSelect",
    valueOptions: ["male", "female"],
  },
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(rows);
  }, [rows]);

  useEffect(() => {
    async function fetchUserData() {
      const userData = await axios
        .get("/user")
        .then((res) => {
          const userRows = res.data.map((user: any) => {
            return {
              id: user?.userId,
              firstName: user?.Person?.fname,
              middleName: user?.Person?.mname,
              lastName: user?.Person?.lname,
              email: user?.Person?.email,
              phone: user?.Person?.phone,
              city: user?.Person?.city,
              street: user?.Person?.street,
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
          setRows(userRows);
          console.log(userRows);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        })
        .finally(() => setIsLoading(false));
      return userData;
    }

    fetchUserData();
    // const refreshToken = Cookies.get("refresh_token");
    // getRefreshToken(refreshToken as string);
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
          onClick={() => navigate("/create-new-user")}
        >
          Add New User
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

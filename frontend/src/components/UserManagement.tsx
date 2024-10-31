import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { Loading } from "./Loading";
import { ReportModal } from "./ReportModal";
import DownloadButton from "./DownloadButton";
type UserType = {
  userId: number;
  ServiceProvider: {
    Volunteer: {
      Person: {
        Address: {
          state: string;
          city: string;
          district: string;
          village: string;
        };
        fname: string;
        mname: string;
        momname: string;
        lname: string;
        email: string;
        phone: string;
        fixPhone: string;
        nationalNumber: string;
        city: string;
        street: string;
        study: string;
        work: string;
        gender: string;
        bDate: string;
        smoking: string;
        prevVol: string;
        compSkill: string;
        koboSkill: string;
        note: string;
        File: { id: number; file: { type: string; data: number[] } };
      };
    };
    Position: { name: string };
    Department: { name: string; description: string };
  };
  Role: { name: string; description: string };
};
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", minWidth: 150 },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    valueGetter: (_value, row) =>
      `${row.firstName || ""} ${row.lastName || ""}`,
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
  { field: "motherName", headerName: "Mother name", minWidth: 150 },
  { field: "lastName", headerName: "Last name", minWidth: 150 },
  { field: "email", headerName: "Email", minWidth: 150 },
  { field: "phone", headerName: "Phone", minWidth: 150 },
  { field: "fixPhone", headerName: "Fix Phone", minWidth: 150 },
  { field: "position", headerName: "Position", minWidth: 150 },
  { field: "study", headerName: "Study", minWidth: 150 },
  { field: "address", headerName: "Address", minWidth: 250 },
  { field: "work", headerName: "Work", minWidth: 150 },
  { field: "nationalNumber", headerName: "National Number", minWidth: 150 },

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

  { field: "compSkill", headerName: "Computer Skills", minWidth: 150 },
  { field: "koboSkill", headerName: "Kobo Skills", minWidth: 150 },
  { field: "prevVol", headerName: "Previous Volunteering", minWidth: 150 },
  { field: "smoking", headerName: "Smoking", minWidth: 150 },
  {
    field: "roleDescription",
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
  {
    field: "note",
    headerName: "Notes  ",
  },
  {
    field: "file",
    headerName: "CV",
    renderCell: (params) => {
      return (
        <DownloadButton
          fileName={`${params.row.firstName} CV`}
          fileBinary={params.row?.file}
        />
      );
    },
  },
];

const paginationModel = { page: 0, pageSize: 5 };
export function UserManagement() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState();
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(rows);
  }, [rows]);

  useEffect(() => {
    async function fetchUserData() {
      const userData = await axios
        .get("/user/")
        .then((res) => {
          const userRows = res.data.map((user: UserType) => {
            console.log(user);
            return {
              id: user?.userId,
              firstName: user?.ServiceProvider?.Volunteer?.Person?.fname,
              middleName: user?.ServiceProvider?.Volunteer?.Person?.mname,
              motherName: user?.ServiceProvider?.Volunteer?.Person?.momname,
              lastName: user?.ServiceProvider?.Volunteer?.Person?.lname,
              email: user?.ServiceProvider?.Volunteer?.Person?.email,
              phone: user?.ServiceProvider?.Volunteer?.Person?.phone,
              fixPhone: user?.ServiceProvider?.Volunteer?.Person?.fixPhone,
              smoking: user?.ServiceProvider?.Volunteer?.Person?.smoking,
              prevVol: user?.ServiceProvider?.Volunteer?.Person?.prevVol,
              compSkill: user?.ServiceProvider?.Volunteer?.Person?.compSkill,
              koboSkill: user?.ServiceProvider?.Volunteer?.Person?.koboSkill,
              note: user?.ServiceProvider?.Volunteer?.Person?.note,
              position: user?.ServiceProvider?.Position?.name,
              study: user?.ServiceProvider?.Volunteer?.Person?.study,
              work: user?.ServiceProvider?.Volunteer?.Person?.work,
              nationalNumber:
                user?.ServiceProvider?.Volunteer?.Person?.nationalNumber,
              address: `${
                user?.ServiceProvider?.Volunteer?.Person?.Address?.state.split(
                  "/"
                )[1]
              } - ${
                user?.ServiceProvider?.Volunteer?.Person?.Address?.city.split(
                  "/"
                )[1]
              } - ${
                user?.ServiceProvider?.Volunteer?.Person?.Address?.district.split(
                  "/"
                )[1]
              } - ${
                user?.ServiceProvider?.Volunteer?.Person?.Address?.village.split(
                  "/"
                )[1]
              }`,
              gender: user?.ServiceProvider?.Volunteer?.Person?.gender,
              birthDate: user?.ServiceProvider?.Volunteer?.Person?.bDate,

              roleName: user?.Role?.name,
              roleDescription: user?.Role?.description,
              departmentName: user?.ServiceProvider?.Department?.name,
              departmentDescription:
                user?.ServiceProvider?.Department?.description,
              file: user?.ServiceProvider?.Volunteer?.Person?.File?.file.data,
            };
          });
          setRows(userRows);
        })
        .catch((err) => {
          console.error(err);
          // setError(err);
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

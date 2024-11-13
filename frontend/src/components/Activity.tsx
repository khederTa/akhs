import React from "react";
import { Stack } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { idID } from "@mui/material/locale";
import { Loading } from "./Loading";
const Activity = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  
  const paginationModel = { page: 0, pageSize: 5 };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "done", headerName: "Done", width: 200 ,
          // Mapping TINYINT(1) value (0 or 1) to a user-friendly display (Done/Not Done)
      renderCell: (params) => (params?.value === true ? "Done" : "Not Done"),
     },
     { field: "title", headerName: "Activity Title ", width: 200 },
  ];

  useEffect(() => {
    async function fetchActivityData() {
      const Activitys = axios
        .get("activities")
        .then((res) => {
          const ActivityRows = res.data.map((activity: any) => {
            return {
              id: activity?.id,
              done: activity?.done,
              title: activity?.title,
            };
          });
          setLoading(false);
          setRows(ActivityRows);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        });
      return Activitys;
    }

    const Activitys = fetchActivityData();
    console.log(Activitys);
  }, []);
  console.log("rows is " , rows)

  // useEffect(() => {
  //     async function fetchUserData() {
  //       const userData = await axios
  //         .get("/users")
  //         .then((res) => {
  //           const userRows = res.data.map((user: any) => {
  //             return {
  //               id: user?.userId,
  //               firstName: user?.Person?.fname,
  //               middleName: user?.Person?.mname,
  //               lastName: user?.Person?.lname,
  //               email: user?.Person?.email,
  //               phone: user?.Person?.phone,
  //               position: user?.position,
  //               study: user?.Person?.study,
  //               work: user?.Person?.work,
  //               gender: user?.Person?.gender,
  //               birthDate: user?.Person?.bDate,
  //               roleName: user?.Role?.name,
  //               roleDescription: user?.Role?.description,
  //               departmentName: user?.Department?.name,
  //               departmentDescription: user?.Department?.description,
  //             };
  //           });
  //           setLoading(false);
  //           setRows(userRows);
  //         })
  //         .catch((err) => {
  //           console.error(err);
  //           setError(err);
  //         });
  //       return userData;
  //     }

  //     const users = fetchUserData();
  //     console.log(users);
  //   }, []);

  return (

    loading ? <Loading/> : 
    <div>
      <Stack direction="row" justifyContent={"flex-start"} sx={{ gap: 1 }}>
        <Button
          type="button"
          variant="contained"
          onClick={() => navigate("/activity-draggable-modal")}
        >
          Add New Activity
        </Button>
      </Stack>
      <Paper sx={{ height: 500, width: "100%" }}>
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
};

export default Activity;

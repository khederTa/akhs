import React, { useState } from "react";
import SessionInfo from "./SessionInfo";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const ActivityInfo = () => {
  const [sessions, setSessions] = useState([{ key: 1 }]);

  const addSession = () => {
    const newKey =
      sessions.length > 0 ? Math.max(...sessions.map((s) => s.key)) + 1 : 1;
    setSessions([...sessions, { key: newKey }]);
  };

  // Function to remove a session by its ID
  const removeSession = (keyToRemove: number) => {
    setSessions(sessions.filter((session) => session.key !== keyToRemove));
  };
  // data for columns and rows
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "middleName", headerName: "Middle name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "email", headerName: "Email", width: 130 },
    { field: "bDate", headerName: "Bdate", width: 130 },
    { field: "study", headerName: "Study", width: 130 },
    { field: "work", headerName: "Work", width: 130 },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];
  const paginationModel = { page: 0, pageSize: 5 };
  console.log("session number", addSession);

  return (
    <div>
      {sessions.map(({ key }) => (
        <div key={key}>
          Session {key}
          <SessionInfo key={key} removeSession={() => removeSession(key)} />
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" sx={{ marginTop: 2 }} onClick={addSession}>
          Add Session
        </Button>
      </div>

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
};

export default ActivityInfo;

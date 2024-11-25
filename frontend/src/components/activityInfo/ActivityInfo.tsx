/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import SessionInfo from "./SessionInfo";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import axios from "../../utils/axios";

const ActivityInfo = () => {
  const [sessions, setSessions] = useState([
    {
      key: 1,
      sessionName: "",
      serviceProviders: [],
      trainers: [],
      hallName: "",
      dateValue: "",
      providerNames: [],
      trainerName: [],
      startTime: dayjs("2022-04-17T15:30"),
      endTime: dayjs("2022-04-17T15:30"),
    },
  ]);

  const [rows, setRows] = useState([]);
  const [, setLoading] = useState(true);
  useEffect(() => {
    async function fetchVolunteerData() {
      const volunteerData = await axios
        .get("/volunteers")
        .then((res) => {
          const volunteerRows = res.data.map((volunteer: any) => {
            return {
              id: volunteer?.volunteerId,
              firstName: volunteer?.Person?.fname,
              middleName: volunteer?.Person?.mname,
              lastName: volunteer?.Person?.lname,
              email: volunteer?.Person?.email,
              phone: volunteer?.Person?.phone,

              study: volunteer?.Person?.study,
              work: volunteer?.Person?.work,
              gender: volunteer?.Person?.gender,
              birthDate: volunteer?.Person?.bDate,
              disable: volunteer?.disable,
              disable_status: volunteer?.disable_status,
            };
          });
          setLoading(false);
          setRows(volunteerRows);
        })
        .catch((err) => {
          console.error(err);
        });
      return volunteerData;
    }

    const volunteers = fetchVolunteerData();
    console.log(volunteers);
  }, []);

  const handleSessionChange = (key: any, field: any, value: any) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.key === key ? { ...session, [field]: value } : session
      )
    );
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    // Filter out sessions where all fields are filled
    const nonEmptySessions = sessions.filter((session) => {
      return (
        session.sessionName.trim() !== "" &&
        session.serviceProviders.length > 0 &&
        session.trainers.length > 0 &&
        session.hallName.trim() !== "" &&
        session.dateValue.trim() !== ""
      );
    });

    nonEmptySessions.forEach((session) => {
      const sessionData = {
        name: session.sessionName,
        date: session.dateValue,
        hall_name: session.hallName,
        startTime: session.startTime?.format("HH:mm:ss"),
        endTime: session.endTime?.format("HH:mm:ss"),
        trainerIds: session.trainerName.map((trainer: any) => trainer.value),
        serviceProviderIds: session.providerNames.map(
          (provider: any) => provider.value
        ),
      };

      axios
        .post("/sessions", sessionData)
        .then((response) => {
          console.log("Session created:", response.data);
          window.location.reload(); // Reload to clear the form
        })
        .catch((error) => {
          console.error("Error creating session:", error);
        });
    });
  };

  const addSession = () => {
    const newKey =
      sessions.length > 0 ? Math.max(...sessions.map((s) => s.key)) + 1 : 1;
    setSessions([
      ...sessions,
      {
        key: newKey,
        sessionName: "",
        serviceProviders: [],
        trainers: [],
        hallName: "",
        dateValue: "",
        providerNames: [],
        trainerName: [],
        startTime: dayjs("2022-04-17T15:30"),
        endTime: dayjs("2022-04-17T15:30"),
      },
    ]);
  };

  const removeSession = (keyToRemove: any) => {
    setSessions(sessions.filter((session) => session.key !== keyToRemove));
  };

  const columns: any[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "middleName", headerName: "Middle name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    { field: "age", headerName: "Age", type: "number", width: 90 },
    { field: "gender", headerName: "Gender", width: 90 },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      valueGetter: (_value: any, row: { firstName: any; lastName: any }) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
      minWidth: 150,
    },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "email", headerName: "Email", width: 130 },
    { field: "birthDate", headerName: "Bdate", width: 130 },
    { field: "study", headerName: "Study", width: 130 },
    { field: "work", headerName: "Work", width: 130 },
    { field: "disable", headerName: "Disable", width: 130 },
    { field: "disable_status", headerName: "Disable_status", width: 130 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <div>
      {sessions.map((session) => (
        <div key={session.key}>
          Session {session.key}
          <SessionInfo
            sessionName={session.sessionName}
            setSessionName={(value: any) =>
              handleSessionChange(session.key, "sessionName", value)
            }
            serviceProviders={session.serviceProviders}
            setServiceProviders={(value: any) =>
              handleSessionChange(session.key, "serviceProviders", value)
            }
            trainers={session.trainers}
            setTrainers={(value: any) =>
              handleSessionChange(session.key, "trainers", value)
            }
            hallName={session.hallName}
            setHallName={(value: any) =>
              handleSessionChange(session.key, "hallName", value)
            }
            dateValue={session.dateValue}
            setDateValue={(value: any) =>
              handleSessionChange(session.key, "dateValue", value)
            }
            providerNames={session.providerNames}
            setProviderNames={(value: any) =>
              handleSessionChange(session.key, "providerNames", value)
            }
            trainerName={session.trainerName}
            setTrainerName={(value: any) =>
              handleSessionChange(session.key, "trainerName", value)
            }
            startTime={session.startTime}
            setStartTime={(value: any) =>
              handleSessionChange(session.key, "startTime", value)
            }
            endTime={session.endTime}
            setEndTime={(value: any) =>
              handleSessionChange(session.key, "endTime", value)
            }
            removeSession={() => removeSession(session.key)}
          />
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" sx={{ marginTop: 2 }} onClick={addSession}>
          Add Session
        </Button>
      </div>

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
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Create Activity
      </Button>
    </div>
  );
};

export default ActivityInfo;

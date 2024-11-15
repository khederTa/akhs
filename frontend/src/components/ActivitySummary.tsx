import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Box, TextField, MenuItem } from "@mui/material";
import axios from "../utils/axios";
import SessionInfo from "./activityInfo/SessionInfo";
import useSessionStore from "../store/activityStore"; // Import Zustand store

type ItemType = {
  id: number;
  name: string;
};

export default function ActivitySummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  console.log("the data is", data);
  console.log("location is ", location);

  const [title, setTitle] = useState(location.state?.title || "");
  const [activityTypes, setActivityTypes] = React.useState<ItemType[]>([]);
  const [departments, setDepartments] = React.useState<ItemType[]>([]);

  const [startDate, setStartDate] = useState(location.state.startDate || null);
  const [selectedActivityType, setSelectedActivityType] = useState(
    data.activityType?.id || ""
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    data.department?.id || ""
  );

  const depObject = useMemo(
    () => departments.find((dep) => dep.id === parseInt(selectedDepartment)),
    [departments, selectedDepartment]
  );
  const activitytypeObject = useMemo(
    () =>
      activityTypes.find((act) => act.id === parseInt(selectedActivityType)),
    [activityTypes, selectedActivityType]
  );
  
  console.log("selected departmen is" , selectedDepartment)

  // Zustand store session state management
  const {
    numSessions,
    minSessions,
    sessions,
    setMinSessions,
    setNumSessions,
    addSession,
    removeSession,
    updateSession,
    syncSessionsWithNum,
  } = useSessionStore((state) => ({
    numSessions: state.numSessions,
    sessions: state.sessions,
    minSessions: state.minSessions,
    setMinSessions: state.setMinSessions,
    setNumSessions: state.setNumSessions,
    addSession: state.addSession,
    removeSession: state.removeSession,
    updateSession: state.updateSession,
    syncSessionsWithNum: state.syncSessionsWithNum,
  }));

  useEffect(() => {
    syncSessionsWithNum();
    setMinSessions(Math.ceil(numSessions / 2));
  }, [numSessions]);

  // Fetch activity types and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityResponse, departmentResponse] = await Promise.all([
          axios.get("/activityType"),
          axios.get("/department"),
        ]);
        setActivityTypes(activityResponse.data);
        setDepartments(departmentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  console.log("session number is", numSessions);

  const handleNext = useCallback(() => {
    // Helper function to validate if a single session is complete
    const isSessionComplete = (session:any) => {
      return (
        session.sessionName.trim() !== "" &&
        session.serviceProviders.length > 0 &&
        session.trainers.length > 0 &&
        session.hallName.trim() !== "" &&
        session.dateValue &&
        session.dateValue.isValid() &&
        session.startTime &&
        session.startTime.isValid() &&
        session.endTime &&
        session.endTime.isValid()
      );
    };
  
    // Find incomplete sessions
    const incompleteSessions = sessions.filter((session) => !isSessionComplete(session));
  
    if (incompleteSessions.length > 0) {
      // Display an alert with specific feedback if there are any incomplete sessions
      alert(
        `Please complete all information for each session. You have ${
          incompleteSessions.length
        } session(s) with missing information.`
      );
      return; // Prevent navigation if any session is incomplete
    }
  
    // If all sessions are complete, navigate to the next page
    navigate("/volunteer-page", {
      state: {
        title,
        activityType: activitytypeObject,
        department: depObject,
        sessions,
        numSessions,
        minSessions,
        startDate,
      },
    });
  }, [
    navigate,
    title,
    activitytypeObject,
    depObject,
    sessions,
    numSessions,
    minSessions,
    startDate,
  ]);
  

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const nonEmptySessions = sessions.filter((session) => {
      return (
        session.sessionName.trim() !== "" &&
        session.serviceProviders.length > 0 &&
        session.trainers.length > 0 &&
        session.hallName.trim() !== "" &&
        session.dateValue.isValid()
      );
    });

    nonEmptySessions.forEach((session) => {
      const sessionData = {
        name: session.sessionName,
        date: session.dateValue.format("YYYY-MM-DD"),
        hall_name: session.hallName,
        startTime: session.startTime.format("HH:mm:ss"),
        endTime: session.endTime.format("HH:mm:ss"),
        trainerIds: session.trainerName.map((trainer: any) => trainer.value),
        serviceProviderIds: session.providerNames.map(
          (provider: any) => provider.value
        ),
      };

      axios
        .post("/sessions", sessionData)
        .then((response) => {
          console.log("Session created:", response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error creating session:", error);
        });
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Activity Summary</Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        fullWidth
        select
        label="Activity Type"
        value={selectedActivityType}
        onChange={(e) => setSelectedActivityType(e.target.value)}
        required
      >
        {activityTypes.map((type: any) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        select
        label="Department"
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
        required
      >
        {departments.map((dept: any) => (
          <MenuItem key={dept.id} value={dept.id}>
            {dept.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Number of Sessions"
        type="number"
        value={numSessions}
        onChange={(e) => {
          const val = Math.max(1, parseInt(e.target.value) || 1);
          setNumSessions(val);
          setMinSessions(Math.ceil(val / 2));
        }}
        required
      />
      <TextField
        label="Minimum Required Sessions"
        type="number"
        value={minSessions}
        onChange={(e) => {
          const val = parseInt(e.target.value) || 1;
          if (val >= Math.ceil(numSessions / 2) && val <= numSessions)
            setMinSessions(val);
        }}
        required
      />
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <Button onClick={() => navigate("/")}>Back to Activities</Button>

      <div>
        {sessions.map((session) => (
          <div key={session.key}>
            Session {session.key}
            <SessionInfo
              sessionName={session.sessionName}
              selectedDepartment = {selectedDepartment}
              setSessionName={(value: any) =>
                updateSession(session.key, "sessionName", value)
              }
              serviceProviders={session.serviceProviders}
              setServiceProviders={(value: any) =>
                updateSession(session.key, "serviceProviders", value)
              }
              trainers={session.trainers}
              setTrainers={(value: any) =>
                updateSession(session.key, "trainers", value)
              }
              hallName={session.hallName}
              setHallName={(value: any) =>
                updateSession(session.key, "hallName", value)
              }
              dateValue={session.dateValue}
              setDateValue={(value: any) =>
                updateSession(session.key, "dateValue", value)
              }
              providerNames={session.providerNames}
              setProviderNames={(value: any) =>
                updateSession(session.key, "providerNames", value)
              }
              trainerName={session.trainerName}
              setTrainerName={(value: any) =>
                updateSession(session.key, "trainerName", value)
              }
              startTime={session.startTime}
              setStartTime={(value: any) =>
                updateSession(session.key, "startTime", value)
              }
              endTime={session.endTime}
              setEndTime={(value: any) =>
                updateSession(session.key, "endTime", value)
              }
              removeSession={() => removeSession(session.key)}
            />
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            sx={{ marginTop: 2 }}
            onClick={addSession}
          >
            Add Session
          </Button>
          <Button
            variant="contained"
            sx={{ marginTop: 2 }}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </Box>
  );
}

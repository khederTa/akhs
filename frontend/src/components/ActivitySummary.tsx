import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Box, TextField, MenuItem } from "@mui/material";
import axios from "../utils/axios";
import SessionInfo from "./activityInfo/SessionInfo";
import useSessionStore from "../store/activityStore"; // Import Zustand store
import { Loading } from "./Loading";
import dayjs from "dayjs";
type ItemType = {
  id: number;
  name: string;
};
type ActivityData = {
  id: number;
  numSessions: number;
  minSessions: number;
  title: string;
  done: boolean;
  departmentId: number;
  activityTypeId: number;
  Volunteers: any;
  Sessions: any;
  Department: object;
  ActivityType: object;
  startDate : string;
};

export default function ActivitySummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  // Zustand store session state management
  const {
    numSessions,
    minSessions,
    sessions,
    title,
    startDate,
    activityType,
    department,
    setActivityType,
    setDepartment,
    setStartDate,
    setTitle,
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
    title: state.title,
    startDate: state.startDate,
    activityType: state.activityType,
    department: state.department,
    setTitle: state.setTitle,
    setDepartment: state.setDepartment,
    setActivityType: state.setActivityType,
    setStartDate: state.setStartDate,
    setMinSessions: state.setMinSessions,
    setNumSessions: state.setNumSessions,
    addSession: state.addSession,
    removeSession: state.removeSession,
    updateSession: state.updateSession,
    syncSessionsWithNum: state.syncSessionsWithNum,
  }));
  const defaultActivityData: ActivityData = {
    id: 0,
    numSessions: 0,
    minSessions: 0,
    title: "",
    done: false,
    departmentId: 0,
    activityTypeId: 0,
    Volunteers: null,
    Sessions: null,
    Department: {},
    ActivityType: {},
    startDate :"",
    
  };
  const [activityTypes, setActivityTypes] = React.useState<ItemType[]>([]);
  const [departments, setDepartments] = React.useState<ItemType[]>([]);
  const [mode, setMode] = useState("create");
  const [selectedActivityType, setSelectedActivityType] = useState(
    activityType?.id || ""
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    department?.id || ""
  );
  const [activityData, setActivityData] =
    useState<ActivityData>(defaultActivityData);

  const depObject = useMemo(
    () => departments.find((dep) => dep.id === parseInt(selectedDepartment)),
    [departments, selectedDepartment]
  );
  const activitytypeObject = useMemo(
    () =>
      activityTypes.find((act) => act.id === parseInt(selectedActivityType)),
    [activityTypes, selectedActivityType]
  );
  console.log("activity data is ", activityData);
  console.log("title is ", title);
  console.log("startDate is" , startDate);
  

  useEffect(() => {
    setDepartment(depObject);
  }, [depObject]);

  useEffect(() => {
    setActivityType(activitytypeObject);
  }, [activitytypeObject]);

  useEffect(() => {
    syncSessionsWithNum();
    setMinSessions(Math.ceil(numSessions / 2));
  }, [numSessions]);

  // Fetch activity types and departments
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const [activityTypeResponse, departmentResponse, activityResponse] =
          await Promise.all([
            axios.get("/activityType"),
            axios.get("/department"),
            location.state &&
              location.state.id &&
              axios.get(`/activity/${location.state.id}`),
          ]);
        setActivityTypes(activityTypeResponse.data);
        setDepartments(departmentResponse.data);
        setActivityData(activityResponse.data);
        console.log("activity respone is ", activityResponse);
        if (activityResponse.status === 200) {
          setMode("edit");
          setTitle(activityResponse.data?.title);
          setNumSessions(activityResponse.data?.numSessions);
          setMinSessions(activityResponse.data?.minSessions);
          setStartDate(activityResponse.data?.startDate);
          setSelectedDepartment(activityResponse.data?.departmentId);
          setSelectedActivityType(activityResponse.data?.activityTypeId)



        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log("session number is", numSessions);

  const handleNext = useCallback(() => {
    // Helper function to validate if a single session is complete
    const isSessionComplete = (session: any) => {
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
    const incompleteSessions = sessions.filter(
      (session) => !isSessionComplete(session)
    );

    if (incompleteSessions.length > 0) {
      // Display an alert with specific feedback if there are any incomplete sessions
      alert(
        `Please complete all information for each session. You have ${incompleteSessions.length} session(s) with missing information.`
      );
      return; // Prevent navigation if any session is incomplete
    }

    // If all sessions are complete, navigate to the next page
    navigate("/volunteer-page");
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

  const handleEditNext = useCallback(() => {
    // If all sessions are complete, navigate to the next page
    navigate("/invited-volunteer");
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

  return loading ? (
    <Loading />
  ) : (
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
       
        defaultValue={dayjs(startDate).format("YYYY-MM-DD")}
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
              selectedDepartment={selectedDepartment}
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
            onClick={mode === "create" ? handleNext : handleEditNext}
          >
            Next
          </Button>
        </div>
      </div>
    </Box>
  );
}

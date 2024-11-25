/* eslint-disable @typescript-eslint/no-explicit-any */
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
// type ActivityData = {
//   id: number;
//   numSessions: number;
//   minSessions: number;
//   title: string;
//   done: boolean;
//   departmentId: number;
//   activityTypeId: number;
//   Volunteers: any;
//   Sessions: any;
//   Department: object;
//   ActivityType: object;
//   startDate: string;
// };

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
    mode,
    activityData,
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
    setSessionValues,
    setMode,
    setActivityData,
  } = useSessionStore((state) => ({
    numSessions: state.numSessions,
    sessions: state.sessions,
    minSessions: state.minSessions,
    title: state.title,
    startDate: state.startDate,
    activityType: state.activityType,
    department: state.department,
    mode: state.mode,
    activityData: state.activityData,
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
    setSessionValues: state.setSessionValues,
    setMode: state.setMode,
    setActivityData: state.setActivityData,
  }));
  // const defaultActivityData: ActivityData = {
  //   id: 0,
  //   numSessions: 0,
  //   minSessions: 0,
  //   title: "",
  //   done: false,
  //   departmentId: 0,
  //   activityTypeId: 0,
  //   Volunteers: null,
  //   Sessions: null,
  //   Department: {},
  //   ActivityType: {},
  //   startDate: "",
  // };
  const [activityTypes, setActivityTypes] = React.useState<ItemType[]>([]);
  const [departments, setDepartments] = React.useState<ItemType[]>([]);
  // const [mode, setMode] = useState("create");
  const [selectedActivityType, setSelectedActivityType] = useState(
    activityType?.id || ""
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    department?.id || ""
  );
  // const [activityData, setActivityData] =
  //   useState<ActivityData>(defaultActivityData);

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
  console.log("startDate is", startDate);
  console.log("sessions is", sessions);
  console.log("mode is", mode);

  useEffect(() => {
    setDepartment(depObject);
  }, [depObject, setDepartment]);

  useEffect(() => {
    setActivityType(activitytypeObject);
  }, [activitytypeObject, setActivityType]);

  useEffect(() => {
    syncSessionsWithNum();
    setMinSessions(Math.ceil(numSessions / 2));
  }, [numSessions, setMinSessions, syncSessionsWithNum]);

  // let providerNames: any = [];
  // const [providers, setProviders] = useState([]);
  // const providers = useRef([]);
  // let trainerName: any = [];
  // Fetch activity types and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          activityTypeResponse,
          departmentResponse,
          providersResponse,
          activityResponse,
        ] = await Promise.all([
          axios.get("/activityType"),
          axios.get("/department"),
          axios.get("/serviceprovider"),
          location.state &&
            location.state.id &&
            axios.get(`/activity/${location.state.id}`),
        ]);
        setActivityTypes(activityTypeResponse.data);
        setDepartments(departmentResponse.data);
        setActivityData(activityResponse.data);
        const sessionsValue: any = activityResponse.data.Sessions;
        console.log("sessionsValue is", sessionsValue);
        console.log("activity respone is ", activityResponse);
        if (activityResponse.status === 200) {
          setMode("edit");
          setTitle(activityResponse.data?.title);
          setNumSessions(activityResponse.data?.numSessions);
          setMinSessions(activityResponse.data?.minSessions);
          setStartDate(activityResponse.data?.startDate);
          setSelectedDepartment(activityResponse.data?.departmentId);
          setSelectedActivityType(activityResponse.data?.activityTypeId);
          // sessions.map((session)=>{

          // })
          const processedSessions = sessionsValue.map((session: any) => ({
            ...session,
            key: session.id,
            providerNames: session.ServiceProviders.map((item: any) => ({
              label: `${item.Volunteer.Person.fname} ${item.Volunteer.Person.lname} - ${item.Position.name}`,
              value: item.providerId,
              depId: item.departmentId,
            })),
            serviceProviders: providersResponse.data,
            dateValue: session.date,
            hallName: session.hall_name,
            sessionName: session.name,
          }));
          setSessionValues(processedSessions);
          // const filteredProviders = providers.filter(
          //   (item: { providerId: any }) =>
          //     sessionsValue.ServiceProviders.find(
          //       (elem: { providerId: any }) =>
          //         elem.providerId === item.providerId
          //     )
          // );
          // setServiceProviders(filteredProviders)
          // providerNames = sessionsValue.ServiceProviders
          console.log(sessionsValue);
          // const providerNames = sessionsValue.map((sessionval: any) => {
          //   return sessionval.ServiceProviders.map((provider: any) => ({
          //     label: provider.Volunteer.Person.fname,
          //     value: provider.providerId,
          //     depId: provider.Department.id,
          //   }));
          // });
          // setProviders(providerNames);
          // providers.current = providerNames;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    // activityData,
    location.state,
    navigate,
    setActivityData,
    setMinSessions,
    setMode,
    setNumSessions,
    setSessionValues,
    setStartDate,
    setTitle,
  ]);

  console.log("session number is", numSessions);

  // console.log("providers in activity summary is ", providers.current);

  const handleNext = useCallback(() => {
    // Helper function to validate if a single session is complete
    const isSessionComplete = (session: any) => {
      return (
        session.sessionName.trim() !== "" &&
        session.serviceProviders.length > 0 &&
        // session.trainers.length > 0 &&
        session.hallName.trim() !== "" &&
        session.dateValue &&
        session.startTime &&
        session.endTime
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
  }, [navigate, sessions]);

  const handleEditNext = useCallback(() => {
    // If all sessions are complete, navigate to the next page
    navigate("/invited-volunteer");
  }, [navigate]);

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
        value={
          dayjs(startDate).isValid()
            ? dayjs(startDate).format("YYYY-MM-DD")
            : ""
        }
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <Button onClick={() => navigate("/")}>Back to Activities</Button>

      <div>
        {sessions.map((session, index) => {
          console.log(session);
          return (
            <React.Fragment key={session.key}>
              <Typography>Session {index + 1}</Typography>
              <SessionInfo
                key={session.key}
                sessionName={session.sessionName}
                selectedDepartment={selectedDepartment}
                setSessionName={(value: any) =>
                  updateSession(session.key, "sessionName", value)
                }
                serviceProviders={session.serviceProviders}
                setServiceProviders={(value: any) =>
                  updateSession(session.key, "serviceProviders", value)
                }
                // trainers={session.trainers}
                // setTrainers={(value: any) =>
                //   updateSession(session.key, "trainers", value)
                // }
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
                // trainerName={session.trainerName}
                // setTrainerName={(value: any) =>
                //   updateSession(session.key, "trainerName", value)
                // }
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
            </React.Fragment>
          );
        })}

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
            onClick={mode === "edit" ? handleEditNext : handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </Box>
  );
}

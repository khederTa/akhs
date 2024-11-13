// // ActivitySummary.tsx
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Button, Typography, Box, TextField, MenuItem } from "@mui/material";
// import axios from "../utils/axios";
// import dayjs from "dayjs";
// import SessionInfo from "./activityInfo/SessionInfo";

// type ItemType = {
//   id: number;
//   name: string;
// };

// export default function ActivitySummary() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const data = location.state;
//   console.log("the data is", data);
//   console.log("loaction is ", location);
//   const [title, setTitle] = useState(location.state?.title || "");
//   // const [departments, setDepartments] = useState<ItemType[]>(
//   //   location.state?.department || ""
//   // );
//   // const [activityTypes, setActivityTypes] = useState<ItemType[]>(
//   //   location.state?.activityType || ""
//   // );
//   const [activityTypes, setActivityTypes] = React.useState<ItemType[]>([]);
//   const [departments, setDepartments] = React.useState<ItemType[]>([]);
//   const [numSessions, setNumSessions] = useState(
//     location.state?.numSessions || 1
//   );
//   const [minSessions, setMinSessions] = useState(
//     location.state?.minSessions || Math.ceil(numSessions / 2)
//   );

//   const [startDate, setStartDate] = useState(location.state.startDate || null);
//   // Initialize selected values based on location state
//   const [selectedActivityType, setSelectedActivityType] = useState(
//     data.activityType?.id || ""
//   );
//   const [selectedDepartment, setSelectedDepartment] = useState(
//     data.department?.id || ""
//   );

//   const depObject = useMemo(
//     () => departments.find((dep) => dep.id === parseInt(selectedDepartment)),
//     [departments, selectedDepartment]
//   );
//   const activitytypeObject = useMemo(
//     () =>
//       activityTypes.find((act) => act.id === parseInt(selectedActivityType)),
//     [activityTypes, selectedActivityType]
//   );

//   const [sessions, setSessions] = useState(() =>
//     Array.from({ length: data.numSessions }, (_, index) => ({
//       key: index + 1,
//       sessionName: "" ,
//       serviceProviders: [],
//       trainers: [],
//       hallName: "",
//       dateValue: dayjs(data.startDate).add(index, "day"),
//       providerNames: [],
//       trainerName: [],
//       startTime: dayjs(),
//       endTime: dayjs(),
//     }))
//   );

//   // Fetch activity types and departments only once
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [activityResponse, departmentResponse] = await Promise.all([
//           axios.get("/activityType"),
//           axios.get("/department"),
//         ]);
//         setActivityTypes(activityResponse.data);
//         setDepartments(departmentResponse.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);
//   // Synchronize sessions with numSessions
//   React.useEffect(() => {
//     const updatedSessions = Array.from({ length: numSessions }, (_, index) => {
//       const existingSession = sessions[index] || {};
//       return {
//         key: index + 1,
//         sessionName: existingSession.sessionName || "",
//         serviceProviders: existingSession.serviceProviders || [],
//         trainers: existingSession.trainers || [],
//         hallName: existingSession.hallName || "",
//         dateValue:
//           existingSession.dateValue || dayjs(data.startDate).add(index, "day"),
//         providerNames: existingSession.providerNames || [],
//         trainerName: existingSession.trainerName || [],
//         startTime: existingSession.startTime || dayjs(),
//         endTime: existingSession.endTime || dayjs(),
//       };
//     });
//     setSessions(updatedSessions);
//   }, [numSessions]);

//   console.log("session number is", numSessions);

//   const handleNext = useCallback(() => {
//     navigate("/volunteer-page", {
//       state: {
//         title,
//         activityType: activitytypeObject,
//         department: depObject,
//         sessions,
//         numSessions,
//         minSessions,
//         startDate,
//       },
//     });
//   }, [
//     navigate,
//     title,
//     activitytypeObject,
//     depObject,
//     sessions,
//     numSessions,
//     minSessions,
//     startDate,
//   ]);

//   const handleSessionChange = (key: number, field: string, value: any) => {
//     setSessions((prevSessions) =>
//       prevSessions.map((session) =>
//         session.key === key ? { ...session, [field]: value } : session
//       )
//     );
//   };

//   const handleSubmit = (event: any) => {
//     event.preventDefault();

//     const nonEmptySessions = sessions.filter((session) => {
//       return (
//         session.sessionName.trim() !== "" &&
//         session.serviceProviders.length > 0 &&
//         session.trainers.length > 0 &&
//         session.hallName.trim() !== "" &&
//         session.dateValue.isValid()
//       );
//     });

//     nonEmptySessions.forEach((session) => {
//       const sessionData = {
//         name: session.sessionName,
//         date: session.dateValue.format("YYYY-MM-DD"),
//         hall_name: session.hallName,
//         startTime: session.startTime.format("HH:mm:ss"),
//         endTime: session.endTime.format("HH:mm:ss"),
//         trainerIds: session.trainerName.map((trainer: any) => trainer.value),
//         serviceProviderIds: session.providerNames.map(
//           (provider: any) => provider.value
//         ),
//       };

//       axios
//         .post("/sessions", sessionData)
//         .then((response) => {
//           console.log("Session created:", response.data);
//           window.location.reload();
//         })
//         .catch((error) => {
//           console.error("Error creating session:", error);
//         });
//     });
//   };

//   const addSession = () => {
//     const newKey =
//       sessions.length > 0 ? Math.max(...sessions.map((s) => s.key)) + 1 : 1;
//     setSessions([
//       ...sessions,
//       {
//         key: newKey,
//         sessionName: "",
//         serviceProviders: [],
//         trainers: [],
//         hallName: "",
//         dateValue: dayjs(data.startDate),
//         providerNames: [],
//         trainerName: [],
//         startTime: dayjs(),
//         endTime: dayjs(),
//       },
//     ]);
//   };

//   const removeSession = useCallback((keyToRemove: number) => {
//     setSessions(sessions.filter((session) => session.key !== keyToRemove));
//   }, []);
//   console.log("sessions is", sessions);

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4">Activity Summary</Typography>

//       <TextField
//         label="Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         fullWidth
//         select
//         label="Activity Type"
//         value={selectedActivityType}
//         onChange={(e) => setSelectedActivityType(e.target.value)}
//         required
//       >
//         {activityTypes.map((type: any) => (
//           <MenuItem key={type.id} value={type.id}>
//             {type.name}
//           </MenuItem>
//         ))}
//       </TextField>
//       <TextField
//         fullWidth
//         select
//         label="Department"
//         value={selectedDepartment}
//         onChange={(e) => setSelectedDepartment(e.target.value)}
//         required
//       >
//         {departments.map((dept: any) => (
//           <MenuItem key={dept.id} value={dept.id}>
//             {dept.name}
//           </MenuItem>
//         ))}
//       </TextField>
//       <TextField
//         label="Number of Sessions"
//         type="number"
//         value={numSessions}
//         onChange={(e) => {
//           const val = Math.max(1, parseInt(e.target.value) || 1);
//           setNumSessions(val);
//           setMinSessions(Math.ceil(val / 2));
//         }}
//         required
//       />
//       <TextField
//         label="Minimum Required Sessions"
//         type="number"
//         value={minSessions}
//         onChange={(e) => {
//           const val = parseInt(e.target.value) || 1;
//           if (val >= Math.ceil(numSessions / 2) && val <= numSessions)
//             setMinSessions(val);
//         }}
//         required
//       />
//       <TextField
//         label="Start Date"
//         type="date"
//         value={startDate}
//         onChange={(e) => setStartDate(e.target.value)}
//         InputLabelProps={{ shrink: true }}
//         fullWidth
//         margin="normal"
//       />
//       <Button onClick={() => navigate("/")}>Back to Activities</Button>

//       <div>
//         {sessions.map((session) => (
//           <div key={session.key}>
//             Session {session.key}
//             <SessionInfo
//               sessionName={session.sessionName}
//               setSessionName={(value: any) =>
//                 handleSessionChange(session.key, "sessionName", value)
//               }
//               serviceProviders={session.serviceProviders}
//               setServiceProviders={(value: any) =>
//                 handleSessionChange(session.key, "serviceProviders", value)
//               }
//               trainers={session.trainers}
//               setTrainers={(value: any) =>
//                 handleSessionChange(session.key, "trainers", value)
//               }
//               hallName={session.hallName}
//               setHallName={(value: any) =>
//                 handleSessionChange(session.key, "hallName", value)
//               }
//               dateValue={session.dateValue}
//               setDateValue={(value: any) =>
//                 handleSessionChange(session.key, "dateValue", value)
//               }
//               providerNames={session.providerNames}
//               setProviderNames={(value: any) =>
//                 handleSessionChange(session.key, "providerNames", value)
//               }
//               trainerName={session.trainerName}
//               setTrainerName={(value: any) =>
//                 handleSessionChange(session.key, "trainerName", value)
//               }
//               startTime={session.startTime}
//               setStartTime={(value: any) =>
//                 handleSessionChange(session.key, "startTime", value)
//               }
//               endTime={session.endTime}
//               setEndTime={(value: any) =>
//                 handleSessionChange(session.key, "endTime", value)
//               }
//               removeSession={() => removeSession(session.key)}
//             />
//           </div>
//         ))}

//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           <Button
//             variant="contained"
//             sx={{ marginTop: 2 }}
//             onClick={addSession}
//           >
//             Add Session
//           </Button>
//           <Button
//             variant="contained"
//             sx={{ marginTop: 2 }}
//             onClick={handleNext}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </Box>
//   );
// }
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Box, TextField, MenuItem } from "@mui/material";
import axios from "../utils/axios";
import dayjs from "dayjs";
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
    setMinSessions(Math.ceil(numSessions / 2))
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

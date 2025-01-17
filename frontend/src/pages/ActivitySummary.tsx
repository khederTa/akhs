/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Box, TextField, MenuItem } from "@mui/material";
import axios from "../utils/axios";
import SessionInfo from "../components/SessionInfo";
import useSessionStore from "../store/activityStore"; // Import Zustand store
import { Loading } from "../components/Loading";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { DirectionContext } from "../shared-theme/AppTheme";
import { useTranslation } from "react-i18next";
import AlertNotification from "../components/AlertNotification";
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
    setDone,
    serviceProvidersInfo,
    setServiceProvidersInfo,
  } = useSessionStore((state) => ({
    numSessions: state.numSessions,
    sessions: state.sessions,
    minSessions: state.minSessions,
    title: state.title,
    hallName: state.hallName,
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
    setDone: state.setDone,
    serviceProvidersInfo: state.serviceProvidersInfo,
    setServiceProvidersInfo: state.setServiceProvidersInfo,
  }));
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  // const [sortedSessions, setSortedSession] = useState<any>([]);
  // useEffect(() => {
  //   const processedSessions = sessions.sort(
  //     (a, b) =>
  //       new Date(a.dateValue).getTime() - new Date(b.dateValue).getTime()
  //   );
  //   setSortedSession(processedSessions);
  // }, [sessions]);
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
    () => departments.find((dep) => dep?.id === parseInt(selectedDepartment)),
    [departments, selectedDepartment]
  );
  const activitytypeObject = useMemo(
    () =>
      activityTypes.find((act) => act?.id === parseInt(selectedActivityType)),
    [activityTypes, selectedActivityType]
  );

  console.log("activity data is ", activityData);
  console.log("title is ", title);
  console.log("startDate is", startDate);
  console.log("sessions is", sessions);
  console.log("mode is", mode);
  console.log("depObject is in activitysummary", depObject);

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
            location.state?.id &&
            axios.get(`/activity/${location.state?.id}`),
        ]);
        if (activityResponse?.data?.done) {
          setActivityTypes(activityTypeResponse?.data);
          setServiceProvidersInfo(providersResponse.data);
        } else {
          const processedActivityType = activityTypeResponse.data.filter(
            (activityType: { active_status: string }) =>
              activityType?.active_status !== "inactive"
          );
          const processedProviders = providersResponse.data.filter(
            (item: any) => {
              console.log(item);
              return item.Volunteer?.active_status !== "inactive";
            }
          );
          setServiceProvidersInfo(processedProviders);

          setActivityTypes(processedActivityType);
        }
        setDepartments(departmentResponse.data);
        setActivityData(activityResponse.data);
        const sessionsValue: any = activityResponse.data.Sessions;
        console.log("sessionsValue is", sessionsValue);
        console.log("activity respone is ", activityResponse);
        if (activityResponse.status === 200) {
          setMode("edit");
          setDone(activityResponse.data?.done);
          setTitle(activityResponse.data?.title);
          setNumSessions(activityResponse.data?.numSessions);
          setMinSessions(activityResponse.data?.minSessions);
          setStartDate(activityResponse.data?.startDate);
          setSelectedDepartment(activityResponse.data?.departmentId);
          setSelectedActivityType(activityResponse.data?.activityTypeId);
          // sessions.map((session)=>{

          // })
          let activeServiceProvider = [];
          console.log({ active_status: activityResponse.data?.done });
          if (activityResponse.data?.done) {
            activeServiceProvider = providersResponse.data;
          } else {
            activeServiceProvider = providersResponse.data.filter(
              (item: any) => {
                console.log(item);
                return item.Volunteer?.active_status !== "inactive";
              }
            );
          }

          console.log({ activeServiceProvider });
          const processedSessions = sessionsValue.map((session: any) => ({
            ...session,
            key: session?.id,
            providerNames: session.ServiceProviders.map((item: any) => ({
              label: `${item.Volunteer.Person.fname} ${item.Volunteer.Person.lname} - ${item.Position.name}`,
              value: item.providerId,
              depId: item.departmentId,
            })),
            serviceProviders: activeServiceProvider,
            dateValue: session.date,
            hallName: session.hall_name,
            sessionName: session.name,
          }));
          const sortedSessions = processedSessions.sort(
            (a: any, b: any) =>
              new Date(a.dateValue).getTime() - new Date(b.dateValue).getTime()
          );
          setSessionValues(sortedSessions);
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
          //     depId: provider.Department?.id,
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
    location.state,
    navigate,
    setActivityData,
    setDone,
    setMinSessions,
    setMode,
    setNumSessions,
    setServiceProvidersInfo,
    setSessionValues,
    setStartDate,
    setTitle,
  ]);

  console.log("session number is", numSessions);
  
  

  // console.log("providers in activity summary is ", providers.current);
  const { direction } = useContext(DirectionContext);
  const { t } = useTranslation();
  const handleNext = useCallback(() => {
    // Helper function to validate if a single session is complete
    const isSessionComplete = (session: any) => {
      return (
        session.sessionName.trim() !== "" &&
        // session.serviceProviders.length > 0 &&
        // session.trainers.length > 0 &&
        session.hallName.trim() !== "" &&
        session.dateValue &&
        session.startTime &&
        session.endTime &&
        session.providerNames.length > 0
      );
    };

    // Find incomplete sessions
    const incompleteSessions = sessions.filter(
      (session) => !isSessionComplete(session)
    );

    if (
      incompleteSessions.length > 0 ||
      title.length === 0 ||
      startDate.length === 0
    ) {
      // Display an alert with specific feedback if there are any incomplete sessions

      setAlertMessage(
        `Please complete all information for each session. You have ${incompleteSessions.length} session(s) with missing information.`
      );
      setAlertSeverity("error");
      setAlertOpen(true);
      return; // Prevent navigation if any session is incomplete
    }

    // If all sessions are complete, navigate to the next page
    if (numSessions > 0) {
      navigate("/volunteer-page");
      console.log("number of sessions after accept is in create", numSessions);
    } else {
      setAlertMessage("there is no sessions add new one");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  }, [navigate, numSessions, sessions, startDate.length, title.length]);

  const handleEditNext = useCallback(() => {
    // Helper function to validate if a single session is complete
    const isSessionComplete = (session: any) => {
      return (
        session.sessionName.trim() !== "" &&
        session.serviceProviders.length > 0 &&
        // session.trainers.length > 0 &&
        session.hallName.trim() !== "" &&
        session.dateValue &&
        session.startTime &&
        session.endTime &&
        session.providerNames.length > 0
      );
    };

    // Find incomplete sessions
    const incompleteSessions = sessions.filter(
      (session) => !isSessionComplete(session)
    );

    if (
      incompleteSessions.length > 0 ||
      title.length === 0 ||
      startDate.length === 0
    ) {
      // Display an alert with specific feedback if there are any incomplete sessions
      // alert(
      //   `Please complete all information for each session. You have ${incompleteSessions.length} session(s) with missing information.`
      // );
      setAlertMessage(
        "there are some missing sessions' information, please complete all information for each session."
      );
      setAlertSeverity("error");
      setAlertOpen(true);
      return; // Prevent navigation if any session is incomplete
    }

    // If all sessions are complete, navigate to the next page
    if (numSessions > 0) {
      navigate("/invited-volunteer");
      console.log("number of sessions after accept is in edit", numSessions);
    } else {
      console.log("add new session when editing", numSessions);
      setAlertMessage("there is no sessions");
      setAlertSeverity("error");
      setAlertOpen(true);
      // alert("there is no sessions");
    }
  }, [navigate, numSessions, sessions, startDate.length, title.length]);

  const handleChangeDepartment = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      sessions.map((session) => {
        updateSession(session.key, "providerNames", []);
        setSelectedDepartment(e.target.value);
      });
    },
    [sessions, updateSession]
  );

  const transformedProviders = useMemo(() => {
    const providers = serviceProvidersInfo.map((provider: any) => ({
      label: `${provider.Volunteer.Person.fname} ${
        provider.Volunteer.Person.lname
      } - ${provider.Position?.name || "N/A"}`,
      value: provider.providerId,
      depId: provider.Department?.id,
    }));
    return providers;
  }, [serviceProvidersInfo]);

  return loading ? (
    <Loading />
  ) : (
    <>
      {alertOpen && (
        <AlertNotification
          open={alertOpen}
          message={alertMessage}
          severity={alertSeverity}
          onClose={handleAlertClose}
        />
      )}

      {/* <Typography variant="h4">{t("activity summary")}</Typography> */}

      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <TextField
          label={t("title")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ width: "175px" }}
          margin="normal"
          required
        />
        <TextField
          select
          label={t("activity type")}
          value={selectedActivityType}
          onChange={(e) => setSelectedActivityType(e.target.value)}
          sx={{ width: "175px" }}
          margin="normal"
          required
        >
          {activityTypes.map((type: any) => (
            <MenuItem key={type?.id} value={type?.id}>
              {type.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t("department")}
          value={selectedDepartment}
          onChange={handleChangeDepartment}
          sx={{ width: "175px" }}
          margin="normal"
          required
        >
          {departments.map((dept: any) => (
            <MenuItem key={dept?.id} value={dept?.id}>
              {dept.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t("numSessions")}
          type="number"
          value={numSessions}
          onChange={(e) => {
            const val = Math.max(1, parseInt(e.target.value) || 1);
            setNumSessions(val);
            setMinSessions(Math.ceil(val / 2));
          }}
          sx={{ width: "175px" }}
          margin="normal"
          required
        />
        <TextField
          label={t("minSessions")}
          type="number"
          value={minSessions}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 1;
            if (val >= Math.ceil(numSessions / 2) && val <= numSessions)
              setMinSessions(val);
          }}
          sx={{ width: "175px" }}
          margin="normal"
          required
        />

        <TextField
          label={t("start date")}
          type="date"
          value={
            dayjs(startDate).isValid()
              ? dayjs(startDate).format("YYYY-MM-DD")
              : ""
          }
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ width: "175px" }}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        {sessions.map((session: any, index: number) => {
          // console.log(session);
          const sessionProps = {
            key: session.key,
            sessionName: session.sessionName,
            setSessionName: (value: any) =>
              updateSession(session.key, "sessionName", value),
            hallName: session.hallName,
            setHallName: (value: any) =>
              updateSession(session.key, "hallName", value),
            dateValue: session.dateValue,
            setDateValue: (value: any) =>
              updateSession(session.key, "dateValue", value),
            min: index > 0 ? sessions[index - 1]?.dateValue : null,
            max:
              index < numSessions - 1 ? sessions[index + 1]?.dateValue : null,
            removeSession: () => removeSession(session.key),
          };

          const timeProps = {
            startTime: session.startTime,
            setStartTime: (value: any) =>
              updateSession(session.key, "startTime", value),
            endTime: session.endTime,
            setEndTime: (value: any) =>
              updateSession(session.key, "endTime", value),
          };

          const providerProps = {
            providerNames: session.providerNames,
            setProviderNames: (value: any) =>
              updateSession(session.key, "providerNames", value),
            transformedProviders,
            selectedDepartment,
          };

          return (
            <div key={session.key} style={{ width: "100%" }}>
              <Typography>
                {t("session")} {index + 1}
              </Typography>
              <SessionInfo
                sessionProps={sessionProps}
                timeProps={timeProps}
                providerProps={providerProps}
              />

              {/* <SessionInfo
                key={session.key}
                done={done}
                sessionName={session.sessionName}
                selectedDepartment={selectedDepartment}
                setSessionName={(value: any) =>
                  updateSession(session.key, "sessionName", value)
                }
                serviceProviders={
                  mode === "edit"
                    ? session.serviceProviders
                    : serviceProvidersInfo
                }
                transformedProviders={transformedProviders}
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
                min={index > 0 ? sessions[index - 1]?.dateValue : null}
                max={
                  index < numSessions - 1
                    ? sessions[index + 1]?.dateValue
                    : null
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
              /> */}
            </div>
          );
        })}
        <Button variant="outlined" sx={{ marginTop: 2 }} onClick={addSession}>
          <AddIcon />
          {t("add session")}
        </Button>
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {direction === "ltr" ? (
          <>
            <Button
              onClick={() => {
                setMode("");
                navigate("/activity-management");
              }}
              variant="outlined"
            >
              <ArrowBackIcon fontSize="small" /> {t("back to activities")}
            </Button>
            <Button
              variant="contained"
              onClick={mode === "edit" ? handleEditNext : handleNext}
            >
              {t("next")} <ArrowForwardIcon fontSize="small" />
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                setMode("");
                navigate("/activity-management");
              }}
              variant="outlined"
            >
              <ArrowForwardIcon fontSize="small" /> {t("back to activities")}
            </Button>
            <Button
              variant="contained"
              onClick={mode === "edit" ? handleEditNext : handleNext}
            >
              {t("next")} <ArrowBackIcon fontSize="small" />
            </Button>
          </>
        )}
      </div>
    </>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../utils/axios";
import useSessionStore from "../store/activityStore";

export default function ExecuteActivity() {
  const location = useLocation();

  const {
    title,
    setTitle,
    done,
    setDone,
    numSessions,
    setNumSessions,
    minSessions,
    setMinSessions,
    department,
    setDepartment,
    activityType,
    setActivityType,
    sessions,
    addNewSession,
    invitedVolunteerIds,
    addInvitedVolunteerIds,
    sessionIds,
    addSessionIds,
  } = useSessionStore((state) => ({
    title: state.title,
    setTitle: state.setTitle,
    done: state.done,
    setDone: state.setDone,
    numSessions: state.numSessions,
    setNumSessions: state.setNumSessions,
    minSessions: state.minSessions,
    setMinSessions: state.setMinSessions,
    department: state.department,
    setDepartment: state.setDepartment,
    activityType: state.activityType,
    setActivityType: state.setActivityType,
    sessions: state.sessions,
    addNewSession: state.addNewSession,
    invitedVolunteerIds: state.invitedVolunteerIds,
    addInvitedVolunteerIds: state.addInvitedVolunteerIds,
    sessionIds: state.sessionIds,
    addSessionIds: state.addSessionIds,
  }));
  useEffect(() => {
    async function fetchActivityData() {
      const response = await axios.get(`/activity/${location.state.id}`);
      console.log(response);
      if (response.status === 200) {
        setTitle(response.data.title);
        setDone(response.data.done);
        setNumSessions(response.data.numSessions);
        setMinSessions(response.data.minSessions);
        setDepartment(response.data.Department);
        setActivityType(response.data.ActivityType);

        response.data.Sessions.map((session: any) => {
          addSessionIds(session.id);
          addNewSession({
            key: session.id,
            sessionName: session.name,
            dateValue: session.date,
            hallName: session.hall_name,
            startTime: session.startTime,
            endTime: session.endTime,
            providerNames: session.ServiceProviders,
            trainerName: session.ServiceProviders,
          });
        });

        response.data.Volunteers.map((volunteer: { volunteerId: number }) =>
          addInvitedVolunteerIds(volunteer.volunteerId)
        );
      }
    }
    fetchActivityData();
  }, [
    addNewSession,
    location.state.id,
    setActivityType,
    setDepartment,
    setDone,
    addInvitedVolunteerIds,
    setMinSessions,
    setNumSessions,
    addSessionIds,
    setTitle,
  ]);
  console.log({
    title,
    done,
    numSessions,
    minSessions,
    department,
    activityType,
    sessions,
    invitedVolunteerIds,
    sessionIds,
  });
  return <>hi</>;
}

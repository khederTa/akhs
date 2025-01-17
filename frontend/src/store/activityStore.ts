/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import dayjs from "dayjs";
import isDateInFormat from "../utils/isDateInFormat";

// Session type
type SessionType = {
  id: number;
  key: number;
  sessionName: string;
  serviceProviders?: any[];
  trainers?: any[];
  hallName: string;
  dateValue: any; // Will be a dayjs object
  providerNames: any[];
  trainerName: any[];
  startTime: any; // dayjs object
  endTime: any; // dayjs object
};

type ActivityStore = {
  title: string;
  hallName: string;
  done: boolean;
  sessions: SessionType[];
  numSessions: number;
  minSessions: number;
  department: any;
  activityType: any;
  startDate: string;
  sessionIds: number[];
  invitedVolunteerIds: number[];
  mode: string;
  activityData: any;
  serviceProvidersInfo: any[];
  setServiceProvidersInfo: (value: any[]) => void;
  setInvitedVolunteerIds: (value: number[]) => void;
  setSessionIds: (value: number[]) => void;
  setTitle: (value: string) => void;
  setHallName: (value: string) => void;
  setDepartment: (value: any) => void;
  setActivityType: (value: any) => void;
  setDone: (value: boolean) => void;
  setMinSessions: (num: number) => void;
  addSession: () => void;
  removeSession: (key: number) => void;
  updateSession: (key: number, field: string, value: any) => void;
  syncSessionsWithNum: () => void;
  setNumSessions: (num: number) => void;
  setStartDate: (value: string) => void;
  addNewSession: (value: SessionType) => void;
  addSessionIds: (value: number) => void;
  addInvitedVolunteerIds: (value: number) => void;
  resetStore: () => void;
  setSessionValues: (value: SessionType[]) => void;
  setMode: (value: string) => void;
  setActivityData: (value: any) => void;
};

const useSessionStore = create<ActivityStore>((set) => ({
  sessions: [],
  numSessions: 1,
  minSessions: 1,
  department: {},
  activityType: {},
  title: "",
  hallName: "",
  startDate: "",
  invitedVolunteerIds: [],
  done: false,
  sessionIds: [],
  mode: "",
  activityData: {},
  serviceProvidersInfo: [],
  setServiceProvidersInfo: (value: any) =>
    set((state: any) => {
      return {
        ...state,
        serviceProvidersInfo: value,
      };
    }),
  resetStore: () =>
    set({
      sessions: [],
      numSessions: 1,
      minSessions: 1,
      department: {},
      activityType: {},
      title: "",
      startDate: "",
      hallName: "",
      invitedVolunteerIds: [],
      done: false,
      sessionIds: [],
      mode: "",
    }),
  // Add a new session with default values
  addSession: () =>
    set((state: any) => {
      // const newKey = state.sessions.length
      //   ? Math.max(...state.sessions.map((s: any) => s.key)) + 1
      //   : 1;

      return {
        // sessions: [
        //   ...state.sessions,
        //   {
        //     key: newKey,
        //     sessionName: "",
        //     serviceProviders: [],
        //     trainers: [],
        //     hallName: state.hallName,
        //     dateValue: dayjs(),
        //     providerNames: [],
        //     trainerName: [],
        //     startTime: dayjs().format("HH:mm"),
        //     endTime: dayjs().format("HH:mm"),
        //   },
        // ],
        numSessions: state.numSessions + 1,
      };
    }),
  addNewSession: (newSession) =>
    set((state: any) => {
      if (
        state.sessions.some((session: any) => session.key === newSession.key)
      ) {
        return state; // Skip adding if the session already exists
      }
      return {
        sessions: [...state.sessions, newSession],
        numSessions: state.numSessions + 1,
      };
    }),

  addSessionIds: (value) =>
    set((state: any) => {
      return {
        sessionIds: [...state.sessionIds, value],
      };
    }),
  addInvitedVolunteerIds: (value) =>
    set((state: any) => {
      return {
        invitedVolunteerIds: [...state.invitedVolunteerIds, value],
      };
    }),

  // Remove a session by key
  removeSession: (key) =>
    set((state) => ({
      sessions: state.sessions.filter((session) => session.key !== key),
      numSessions: state.numSessions - 1,
    })),

  // Update session fields
  updateSession: (key, field, value) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.key === key ? { ...session, [field]: value } : session
      ),
    })),

  // Sync sessions with numSessions
  syncSessionsWithNum: () =>
    set((state: any) => {
      const maxDateObject = (state.sessions || []).reduce(
        (session: any, obj: any) => {
          return new Date(session.dateValue) > new Date(obj.dateValue)
            ? session
            : obj;
        },
        { dateValue: "1970-01-01" }
      );
      const maxDate = dayjs(maxDateObject.dateValue);
      const updatedSessions = Array.from(
        { length: state.numSessions },
        (_, index) => {
          const existingSession = state.sessions[index] || {};
          const id =
            existingSession.id && existingSession.id > 0
              ? existingSession.id
              : -1 * (state.numSessions - index);

          const newDateValue =
            state.mode === "edit" || existingSession.dateValue
              ? isDateInFormat(existingSession.dateValue, "YYYY-MM-DD")
                ? existingSession.dateValue
                : existingSession.id > 0
                ? dayjs(existingSession.dateValue).format("YYYY-MM-DD")
                : maxDate.add(1, "day").format("YYYY-MM-DD")
              : dayjs(state.startDate).isValid()
              ? dayjs(state.startDate).add(index, "day").format("YYYY-MM-DD")
              : maxDate.add(index + 1, "day").format("YYYY-MM-DD");
          return {
            id,
            key: index + 1,
            sessionName: existingSession.sessionName || "",
            serviceProviders:
              existingSession.serviceProviders ||
              state.serviceProvidersInfo ||
              [],
            trainers: existingSession.trainers || [],
            hallName:
              existingSession.hallName || state.hallName || "",
            dateValue: newDateValue,
            providerNames: existingSession.providerNames || [],
            trainerName: existingSession.trainerName || [],
            startTime:
              existingSession.startTime ||
              dayjs(existingSession.startTime).format("HH:mm") ||
              dayjs(),
            endTime:
              existingSession.endTime ||
              dayjs(existingSession.endTime).format("HH:mm") ||
              dayjs(),
          };
        }
      );
      return { sessions: updatedSessions };
    }),

  // set the values of the sessions when editing to the sessions that i get from the database
  setSessionValues: (newSessions: SessionType[]) =>
    set((_state) => {
      const updatedSessions = newSessions.map((newSession, _index) => {
        // Merge default values with the provided new values
        return { ...newSession };
      });
      console.log("updatedSessions is", updatedSessions);

      return { sessions: updatedSessions };
    }),

  // Set the number of sessions
  setNumSessions: (num) =>
    set({
      numSessions: num,
    }),
  setMinSessions: (num) =>
    set({
      minSessions: num,
    }),
  setDepartment: (value) =>
    set({
      department: value,
    }),
  setActivityType: (value) =>
    set({
      activityType: value,
    }),
  setTitle: (value) =>
    set({
      title: value,
    }),
  setHallName: (value) =>
    set({
      hallName: value,
    }),
  setStartDate: (value) =>
    set({
      startDate: value,
    }),
  setInvitedVolunteerIds: (value) =>
    set({
      invitedVolunteerIds: value,
    }),

  setSessionIds: (value) =>
    set({
      sessionIds: value,
    }),
  setDone: (value) =>
    set({
      done: value,
    }),
  setMode: (value) =>
    set({
      mode: value,
    }),
  setActivityData: (value) =>
    set({
      activityData: value,
    }),
}));

export default useSessionStore;

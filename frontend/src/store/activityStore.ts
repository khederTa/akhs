import { create } from "zustand";
import dayjs from "dayjs";

// Session type
type SessionType = {
  key: number;
  sessionName: string;
  serviceProviders: any[];
  trainers: any[];
  hallName: string;
  dateValue: any; // Will be a dayjs object
  providerNames: any[];
  trainerName: any[];
  startTime: any; // dayjs object
  endTime: any; // dayjs object
};

type SessionStore = {
  sessions: SessionType[];
  numSessions: number;
  minSessions: number;
  setMinSessions: (num: number) => void;
  addSession: () => void;
  removeSession: (key: number) => void;
  updateSession: (key: number, field: string, value: any) => void;
  syncSessionsWithNum: () => void;
  setNumSessions: (num: number) => void;
};

const useSessionStore = create<SessionStore>((set) => ({
  sessions: [],
  numSessions: 1,
  minSessions: 1,

  // Add a new session with default values
  addSession: () =>
    set((state) => {
      const newKey = state.sessions.length
        ? Math.max(...state.sessions.map((s) => s.key)) + 1
        : 1;

      return {
        sessions: [
          ...state.sessions,
          {
            key: newKey,
            sessionName: "",
            serviceProviders: [],
            trainers: [],
            hallName: "",
            dateValue: dayjs(),
            providerNames: [],
            trainerName: [],
            startTime: dayjs(),
            endTime: dayjs(),
          },
        ],
        numSessions: state.numSessions + 1,
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
    set((state) => {
      const updatedSessions = Array.from(
        { length: state.numSessions },
        (_, index) => {
          const existingSession = state.sessions[index] || {};
          return {
            key: index + 1,
            sessionName: existingSession.sessionName || "",
            serviceProviders: existingSession.serviceProviders || [],
            trainers: existingSession.trainers || [],
            hallName: existingSession.hallName || "",
            dateValue: existingSession.dateValue || dayjs().add(index, "day"),
            providerNames: existingSession.providerNames || [],
            trainerName: existingSession.trainerName || [],
            startTime: existingSession.startTime || dayjs(),
            endTime: existingSession.endTime || dayjs(),
          };
        }
      );

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
}));

export default useSessionStore;

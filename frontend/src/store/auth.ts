import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

interface User {
  userId: string | null;
  username?: string;
}

interface AuthState {
  allUserData: User | null;
  loading: boolean;
  user: () => { userId: string | null; username?: string };
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isLoggedIn: () => boolean;
}

const useAuthStore = create<AuthState>((set, get) => ({
  allUserData: null,
  loading: true,

  user: () => ({
    userId: get().allUserData?.userId || null,
    username: get().allUserData?.username,
  }),

  setUser: (user) => set({ allUserData: user }),
  setLoading: (loading) => set({ loading }),
  isLoggedIn: () => {
    return get().allUserData !== null;
  },
}));

if (import.meta.env.DEV) {
  mountStoreDevtool("Store", useAuthStore);
}

export { useAuthStore };

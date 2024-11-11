import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

// User and AuthState interfaces
interface User {
  userId: string | null;
  username: string | null;
  roleId: number | null;
}

interface AuthState {
  allUserData: User | null;
  loading: boolean;
  user: () => User;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isLoggedIn: () => boolean;
}

// Zustand store
const useAuthStore = create<AuthState>((set, get) => ({
  allUserData: null,
  loading: true,
  user: () => ({
    userId: get().allUserData?.userId || null,
    username: get().allUserData?.username || null,
    roleId: get().allUserData?.roleId || null,
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

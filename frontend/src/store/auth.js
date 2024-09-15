import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

const useAuthStore = create((set, get) => ({
  allUserData: null,
  loading: false,

  user: () => ({
    userId: get().allUserData?.userId || null,
    username: get().allUserData?.username,
  }),

  setUser: (user) => set({ allUserData: user }),
  setLoading: (loading) => set({ loading }),
  isLoggedIn: () => {
    console.log(get());
    return get().allUserData !== null;
  },
}));

if (import.meta.env.DEV) {
  mountStoreDevtool("Store", useAuthStore);
}

export { useAuthStore };

import { create } from "zustand";

interface PermissionState {
  userRole: string;
  permissions: Record<string, boolean | null>;
  permissionsLoading: boolean;
  setPermissionsLoading: (loading: boolean) => void;
  setUserRole: (role: string) => void;
  setPermissions: (permissions: Record<string, boolean | null>) => void;
}

const usePermissionStore = create<PermissionState>((set) => ({
  userRole: "",
  permissions: {},
  permissionsLoading: true,
  setPermissionsLoading: (loading) => set({ permissionsLoading: loading }),
  setUserRole: (role) => set({ userRole: role }),
  setPermissions: (permissions) => set(() => ({ permissions })),
}));

export { usePermissionStore };

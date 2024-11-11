import { create } from "zustand";

interface PermissionState {
  permissions: Record<string, boolean | null>;
  permissionsLoading: boolean;
  setPermissionsLoading: (loading: boolean) => void;
  setPermissions: (permissions: Record<string, boolean | null>) => void;
}

const usePermissionStore = create<PermissionState>((set) => ({
  permissions: {},
  permissionsLoading: true,
  setPermissionsLoading: (loading) => set({ permissionsLoading: loading }),
  setPermissions: (permissions) => set(() => ({ permissions })),
}));

export { usePermissionStore };

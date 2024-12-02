// hooks/useInitializePermissions.ts
import { useEffect } from "react";
import axios from "../utils/axios";
import { useAuthStore } from "../store/auth";
import { usePermissionStore } from "../store/permissionStore";
import { setUser } from "../utils/auth";
const useInitializePermissions = () => {
  const setPermissions = usePermissionStore((state) => state.setPermissions);
  const setUserRole = usePermissionStore((state) => state.setUserRole);
  const roleId = useAuthStore((state) => state.user()?.roleId);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!isLoggedIn()) {
        await setUser();
      }
      if (!roleId && roleId == null) return;
      try {
        const response = await axios.get(`/role/${roleId}/permissions`);
        const permissionsMap = await response.data.permissions.reduce(
          (
            acc: Record<string, boolean>,
            perm: { action: string; resource: string }
          ) => {
            acc[`${perm.action}_${perm.resource}`] = true;
            return acc;
          },
          {}
        );
        setUserRole(response.data.role.name);
        setPermissions({ ...permissionsMap, read_home: roleId !== 3 });
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setPermissions({});
      }
    };

    fetchPermissions();
  }, [isLoggedIn, roleId, setPermissions, setUserRole]);
};

export default useInitializePermissions;

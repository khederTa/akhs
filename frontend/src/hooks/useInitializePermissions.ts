// hooks/useInitializePermissions.ts
import { useEffect } from "react";
import axios from "../utils/axios";
import { useAuthStore } from "../store/auth";
import { usePermissionStore } from "../store/permissionStore";

const useInitializePermissions = () => {
  const setPermissions = usePermissionStore((state) => state.setPermissions);
  const roleId = useAuthStore((state) => state.user()?.roleId);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (roleId === null) return;
      try {
        console.log("render")
        const response = await axios.get(`/role/${roleId}/permissions`);
        const permissionsMap = response.data.reduce(
          (
            acc: Record<string, boolean>,
            perm: { action: string; resource: string }
          ) => {
            acc[`${perm.action}_${perm.resource}`] = true;
            return acc;
          },
          {}
        );
        setPermissions({...permissionsMap, "read_home": true});
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setPermissions({});
      }
    };

    fetchPermissions();
  }, [roleId, setPermissions]);
};

export default useInitializePermissions;

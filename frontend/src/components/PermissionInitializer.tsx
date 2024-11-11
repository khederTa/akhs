// components/PermissionInitializer.tsx
import { useEffect } from "react";
import useInitializePermissions from "../hooks/useInitializePermissions";
import { usePermissionStore } from "../store/permissionStore";

const PermissionInitializer = () => {
  const setPermissionsLoading = usePermissionStore(
    (state) => state.setPermissionsLoading
  );

  // Call `useInitializePermissions` directly to initialize permissions
  useInitializePermissions();

  useEffect(() => {
    // Set loading state for permissions
    setPermissionsLoading(false);
  }, [setPermissionsLoading]);

  return null;
};

export default PermissionInitializer;

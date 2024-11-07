import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import { useTranslation } from "react-i18next";

interface AlertNotificationProps {
  open: boolean;
  message: string;
  severity: AlertColor; // "success" | "error" | "info" | "warning"
  onClose: () => void;
  autoHideDuration?: number;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 5000,
}) => {
  const { t } = useTranslation();
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {t(message)}
      </Alert>
    </Snackbar>
  );
};

export default AlertNotification;

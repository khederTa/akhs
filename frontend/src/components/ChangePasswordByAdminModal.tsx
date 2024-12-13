/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Box,
} from "@mui/material";
import Draggable from "react-draggable";
import axios from "../utils/axios";
import { useTranslation } from "react-i18next";
import PasswordInput from "./PasswordInput";
import AlertNotification from "./AlertNotification";

// Function to make the dialog draggable
function PaperComponent(props: any) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

type PropsType = {
  open: boolean;
  handleClose: () => void;
  userId: number;
};

export default function ChangePasswordByAdminModal({
  open,
  handleClose,
  userId,
}: PropsType) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  const [password1, setPassword1] = useState<any>();
  const [password2, setPassword2] = useState<any>();
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const { t } = useTranslation();
  // const userId = useAuthStore((state) => state.allUserData?.userId);
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(false);
    setPasswordErrorMessage("");

    const pass1 = password1.target.value;
    const pass2 = password2.target.value;

    if (pass1 !== pass2) {
      setPasswordError(true);
      setPasswordErrorMessage(t("password and confirm password must be same"));
      return;
    }
    const formData = {
      newPassword: pass1,
    };

    const response = await axios.put(
      `/auth/change-password-by-admin/${userId}`,
      formData
    );

    if (response.status === 200) {
      setAlertMessage("password changed correctly");
      setAlertSeverity("success");
      handleClose();
    } else {
      setAlertMessage("somthing wrog, try again!");
      setAlertSeverity("error");
    }
    setAlertOpen(true);
  };

  return (
    <>
      <AlertNotification
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleAlertClose}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("change password")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("please fill out the form below to change the password.")}
          </DialogContentText>
          <Box
            component="form"
            id="activity-form" // Added ID here
            onSubmit={handleFormSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <PasswordInput
                label={t("new password")}
                onChange={setPassword1}
              />
              <PasswordInput
                label={t("confirm password")}
                onChange={setPassword2}
                passwordError={passwordError}
                passwordErrorMessage={passwordErrorMessage}
              />
            </Box>
            <DialogActions>
              <Button onClick={handleClose}>{t("cancel")}</Button>
              <Button type="submit" variant="contained" color="primary">
                {t("change")}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

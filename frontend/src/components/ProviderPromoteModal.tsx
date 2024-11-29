/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Paper,
  Box,
} from "@mui/material";
import Draggable from "react-draggable";
import axios from "../utils/axios";
import { useTranslation } from "react-i18next";
import PasswordInput from "./PasswordInput";
import { usePermissionStore } from "../store/permissionStore";

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

type ItemType = {
  id: number;
  name: string;
};
type PropsType = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
};

export default function ProviderPromoteModal({
  open,
  handleClose,
  onSubmit,
}: PropsType) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [password1, setPassword1] = useState<any>();
  const [password2, setPassword2] = useState<any>();
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const { t } = useTranslation();
  const { userRole } = usePermissionStore((state) => state);
  useEffect(() => {
    // Fetch Roles
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/role");
        if (userRole === "officer") {
          const handledRoles = response.data.filter(
            (item: { name: string }) => item.name === "data entry"
          );
          setRoles(handledRoles);
        } else {
          setRoles(response.data);
        }
      } catch (error) {
        console.error("Error fetching Roles:", error);
      }
    };

    fetchRoles();
  }, [userRole]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
      roleId: selectedRole,
      password: pass1,
    };

    onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {t("promote provider")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("please fill out the form below to promote the provider.")}
        </DialogContentText>
        <Box
          component="form"
          id="activity-form" // Added ID here
          onSubmit={handleFormSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              select
              label={t("role")}
              value={selectedRole}
              onChange={(e: any) => setSelectedRole(e.target.value)}
              sx={{ flex: "1 1 100%" }}
              required
            >
              {roles.map((role: ItemType) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>
            <PasswordInput label={t("password")} onChange={setPassword1} />
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
              {t("promote")}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

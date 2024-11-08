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
  Tabs,
  Tab,
} from "@mui/material";
import Draggable from "react-draggable";
import axios from "../utils/axios";
import { useTranslation } from "react-i18next";
import PasswordInput from "./PasswordInput";

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function VolunteerPromoteModal({
  open,
  handleClose,
  onSubmit,
}: PropsType) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [password1, setPassword1] = useState<any>();
  const [password2, setPassword2] = useState<any>();
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    // Fetch Activity Types
    const fetchPositions = async () => {
      try {
        const response = await axios.get("/position");
        setPositions(response.data);
      } catch (error) {
        console.error("Error fetching position:", error);
      }
    };

    // Fetch Departments
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/department");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    // Fetch Roles
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/role");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching Roles:", error);
      }
    };

    fetchPositions();
    fetchDepartments();
    fetchRoles();
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(false);
    setPasswordErrorMessage("");
    let formData;
    if (value === 0) {
      formData = {
        positionId: selectedPosition,
        departmentId: selectedDepartment,
      };
    } else {
      const pass1 = password1.target.value;
      const pass2 = password2.target.value;
      if (pass1 !== pass2) {
        setPasswordError(true);
        setPasswordErrorMessage(
          t("password and confirm password must be same")
        );
        return;
      }
      formData = {
        positionId: selectedPosition,
        departmentId: selectedDepartment,
        roleId: selectedRole,
        password: pass1,
      };
    }
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
        Promote Volunteer
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label={t("promote to provider")} {...a11yProps(0)} />
            <Tab label={t("promote to user")} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <DialogContentText>
            Please fill out the form below to promote the volunteer.
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
                label="Position"
                value={selectedPosition}
                onChange={(e: any) => setSelectedPosition(e.target.value)}
                sx={{ flex: "1 1 100%" }}
                required
              >
                {positions.map((type: ItemType) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Department"
                value={selectedDepartment}
                onChange={(e: any) => setSelectedDepartment(e.target.value)}
                sx={{ flex: "1 1 100%" }}
                required
              >
                {departments.map((dept: ItemType) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <DialogActions>
              <Button onClick={handleClose}>{t("cancel")}</Button>
              <Button type="submit" variant="contained" color="primary">
                {t("promote")}
              </Button>
            </DialogActions>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <DialogContentText>
            Please fill out the form below to promote the volunteer.
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
                label="Position"
                value={selectedPosition}
                onChange={(e: any) => setSelectedPosition(e.target.value)}
                sx={{ flex: "1 1 100%" }}
                required
              >
                {positions.map((type: ItemType) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Department"
                value={selectedDepartment}
                onChange={(e: any) => setSelectedDepartment(e.target.value)}
                sx={{ flex: "1 1 100%" }}
                required
              >
                {departments.map((dept: ItemType) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Role"
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
        </CustomTabPanel>
      </DialogContent>
    </Dialog>
  );
}

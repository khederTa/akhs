/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
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
import { usePermissionStore } from "../store/permissionStore";

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

type ItemType = { id: number; name: string };
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

function CustomTabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function VolunteerPromoteModal({
  open,
  handleClose,
  onSubmit,
}: PropsType) {
  const { t } = useTranslation();
  const { userRole } = usePermissionStore((state) => state);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [departments, setDepartments] = React.useState<ItemType[]>([]);
  const [positions, setPositions] = React.useState<ItemType[]>([]);
  const [roles, setRoles] = React.useState<ItemType[]>([]);
  const [selectedPosition, setSelectedPosition] = React.useState<string>("");
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<string>("");
  const [selectedRole, setSelectedRole] = React.useState<string>("");
  const [password1, setPassword1] = React.useState<string>("");
  const [password2, setPassword2] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [positionRes, departmentRes, roleRes] = await Promise.all([
          axios.get("/position"),
          axios.get("/department"),
          axios.get("/role"),
        ]);
        setPositions(positionRes.data);
        setDepartments(departmentRes.data);
        if (userRole === "officer") {
          const handledRoles = roleRes.data.filter(
            (item: { name: string }) => item.name === "data entry"
          );
          setRoles(handledRoles);
        } else {
          setRoles(roleRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userRole]);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) =>
    setTabIndex(newValue);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError(false);
    setPasswordErrorMessage("");

    if (tabIndex === 1 && password1 !== password2) {
      setPasswordError(true);
      setPasswordErrorMessage(t("password and confirm password must be same"));
      return;
    }

    const formData = {
      positionId: selectedPosition,
      departmentId: selectedDepartment,
      roleId: tabIndex === 1 ? selectedRole : undefined,
      password: tabIndex === 1 ? password1 : undefined,
    };
    onSubmit(formData);
    handleClose();
  };

  const renderSelectField = (
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    items: ItemType[],
    required = true
  ) => (
    <TextField
      select
      label={t(label)}
      value={value}
      onChange={onChange}
      sx={{ flex: "1 1 100%" }}
      required={required}
    >
      {items.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          {item.name}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {t("promote volunteer")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabIndex} onChange={handleChangeTab}>
            <Tab label={t("promote to provider")} />
            <Tab label={t("promote to user")} />
          </Tabs>
        </Box>
        {[0, 1].map((index) => (
          <CustomTabPanel key={index} value={tabIndex} index={index}>
            <DialogContentText>
              {t("please fill out the form below to promote the volunteer.")}
            </DialogContentText>
            <Box
              component="form"
              onSubmit={handleFormSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {renderSelectField(
                  "position",
                  selectedPosition,
                  (e) => setSelectedPosition(e.target.value),
                  positions
                )}
                {renderSelectField(
                  "department",
                  selectedDepartment,
                  (e) => setSelectedDepartment(e.target.value),
                  departments
                )}
                {tabIndex === 1 &&
                  renderSelectField(
                    "role",
                    selectedRole,
                    (e) => setSelectedRole(e.target.value),
                    roles
                  )}
                {tabIndex === 1 && (
                  <>
                    <PasswordInput
                      label={t("password")}
                      onChange={(e: any) => setPassword1(e.target.value)}
                    />
                    <PasswordInput
                      label={t("confirm password")}
                      onChange={(e: any) => setPassword2(e.target.value)}
                      passwordError={passwordError}
                      passwordErrorMessage={passwordErrorMessage}
                    />
                  </>
                )}
              </Box>
              <DialogActions>
                <Button onClick={handleClose}>{t("cancel")}</Button>
                <Button type="submit" variant="contained" color="primary">
                  {t("promote")}
                </Button>
              </DialogActions>
            </Box>
          </CustomTabPanel>
        ))}
      </DialogContent>
    </Dialog>
  );
}

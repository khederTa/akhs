/* eslint-disable @typescript-eslint/no-explicit-any */
// ActivityDraggableModal.tsx
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
} from "@mui/material";
import Draggable from "react-draggable";
import axios from "../utils/axios";
import useSessionStore from "../store/activityStore"; // Import Zustand store
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  onClose: () => void;
};

export default function ActivityDraggableModal({ open, onClose }: PropsType) {
  const [activityTypes, setActivityTypes] = React.useState<ItemType[]>([]);
  const [departments, setDepartments] = React.useState<ItemType[]>([]);
  const [selectedActivityModule, setSelectedActivityModule] =
    React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    hallName,
    setHallName,
    title,
    setTitle,
    numSessions,
    setNumSessions,
    minSessions,
    setMinSessions,
    startDate,
    setStartDate,
    setDepartment,
    setActivityType,
    setMode,
  } = useSessionStore((state) => ({
    hallName: state.hallName,
    setHallName: state.setHallName,
    title: state.title,
    setTitle: state.setTitle,
    numSessions: state.numSessions,
    setNumSessions: state.setNumSessions,
    minSessions: state.minSessions,
    setMinSessions: state.setMinSessions,
    startDate: state.startDate,
    setStartDate: state.setStartDate,
    setDepartment: state.setDepartment,
    setActivityType: state.setActivityType,
    setMode: state.setMode,
  }));

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const activityResponse = await axios.get("/activityType");
        const processedActivityType = activityResponse.data.filter(
          (activityType: { active_status: string }) =>
            activityType.active_status !== "inactive"
        );
        setActivityTypes(processedActivityType);
        const departmentResponse = await axios.get("/department");
        setDepartments(departmentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("selectedDepartment is", selectedDepartment);
    const depObject = departments.find((dep) => {
      return dep.id === parseInt(selectedDepartment);
    });
    const activityModuleObject = activityTypes.find((act) => {
      return act.id === parseInt(selectedActivityModule);
    });
    setMode("create");
    setDepartment(depObject);
    setActivityType(activityModuleObject);
    navigate("/activity-summary");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {t("create activity")}
      </DialogTitle>
      <DialogContent sx={{ minWidth: "300px" }}>
        <DialogContentText>
          {t("please fill out the form below to create a new activity.")}
        </DialogContentText>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <TextField
            label={t("title")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label={t("hall name")}
            value={hallName}
            onChange={(e) => setHallName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            select
            label={t("activity type")}
            value={selectedActivityModule}
            onChange={(e) => setSelectedActivityModule(e.target.value)}
            required
          >
            {activityTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t("department")}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            required
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t("numSessions")}
            type="number"
            value={numSessions}
            onChange={(e) => {
              const val = Math.max(1, parseInt(e.target.value) || 1);
              setNumSessions(val);
              setMinSessions(Math.ceil(val / 2));
            }}
            required
          />
          <TextField
            label={t("minSessions")}
            type="number"
            value={minSessions}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              if (val >= Math.ceil(numSessions / 2) && val <= numSessions)
                setMinSessions(val);
            }}
            required
          />
          <TextField
            label={t("start date")}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <DialogActions>
            <Button onClick={onClose}>{t("cancel")}</Button>
            <Button type="submit" variant="contained" color="primary">
              {t("create")}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

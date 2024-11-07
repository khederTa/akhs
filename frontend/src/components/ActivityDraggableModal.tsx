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
  onClose: () => void;
};

export default function ActivityDraggableModal({ open, onClose }: PropsType) {
  const [activityTypes, setActivityTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedActivityType, setSelectedActivityType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [numSessions, setNumSessions] = useState(1);
  const [minSessions, setMinSessions] = useState(Math.ceil(numSessions / 2));
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    // Fetch Activity Types
    const fetchActivityTypes = async () => {
      try {
        const response = await axios.get("/activityType");
        setActivityTypes(response.data);
      } catch (error) {
        console.error("Error fetching activity types:", error);
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

    fetchActivityTypes();
    fetchDepartments();
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = {
      activityType: selectedActivityType,
      department: selectedDepartment,
      title,
      numSessions,
      minSessions,
      startDate,
    };
    console.log("Form Data:", formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        Create Activity
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out the form below to create a new activity.
        </DialogContentText>
        <Box
          component="form"
          id="activity-form" // Added ID here
          onSubmit={handleFormSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              select
              label="Activity Type"
              value={selectedActivityType}
              onChange={(e: any) => setSelectedActivityType(e.target.value)}
              sx={{ flex: "1 1 100%" }}
              required
            >
              {activityTypes.map((type: ItemType) => (
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

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Number of Sessions"
              type="number"
              value={numSessions}
              onChange={(e: any) => {
                const noSessions = parseInt(e.target.value);
                if (noSessions >= 1) {
                  setNumSessions(noSessions);
                  setMinSessions(Math.ceil(noSessions / 2));
                }
              }}
              sx={{ flex: "1 1 45%" }}
              required
            />
            <TextField
              label="Minimum Required Sessions"
              type="number"
              value={minSessions}
              onChange={(e: any) => {
                const noMinSessions = parseInt(e.target.value);
                if (
                  noMinSessions >= Math.ceil(numSessions / 2) &&
                  noMinSessions <= numSessions
                ) {
                  setMinSessions(noMinSessions);
                }
              }}
              sx={{ flex: "1 1 45%" }}
              required
            />
          </Box>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e: any) => setStartDate(e.target.value)}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              placeholder: "",
            }}
          />

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

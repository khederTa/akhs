import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import axios from "../utils/axios";

import {
  Typography,
  Box,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "500px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export function CreateActivityType() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");

  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidInput, setIsValidInput] = useState(false);
  const [prerequisites, setPrerequisites] = useState([]);
  const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchActivityTypes() {
      await axios
        .get("/activityType")
        .then((res) => setPrerequisites(res.data))
        .catch((error) => console.error(error));
    }
    fetchActivityTypes();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidInput) {
      return;
    }
    const data = new FormData(event.currentTarget);
    setIsLoading(true);
    const name = data.get("name") as string;
    const description = data.get("description") as string;

    try {
      const payload = {
        name,
        description,
        prerequisites: selectedPrerequisites,
      };

      // Send the data to the API via Axios POST request
      const response = await axios
        .post("/activityType", payload)
        .then((res) => {
          if (res.status) {
            navigate("/activity-types"); // Redirect upon success
          }
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("Error creating activity type:", error);
      alert("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };
  const validateInputs = () => {
    let isValid = true;
    if (!name || name.length === 0) {
      setNameError(true);
      setNameErrorMessage("Activity Type Name is Required");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!description || description.length === 0) {
      setDescriptionError(true);
      setDescriptionErrorMessage("Description Field is Required");
      isValid = false;
    } else {
      setDescriptionError(false);
      setDescriptionErrorMessage("");
    }
    setIsValidInput(isValid);
    return isValid;
  };

  return (
    <Card variant="highlighted">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Create New Activity Type
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <TextField
              error={nameError}
              helperText={nameErrorMessage}
              name="name"
              placeholder="e.g. Public Health"
              type="name"
              id="name"
              autoComplete="current-name"
              required
              fullWidth
              variant="outlined"
              color={nameError ? "error" : "primary"}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="description">Desciption</FormLabel>
            <TextField
              error={descriptionError}
              helperText={descriptionErrorMessage}
              name="description"
              placeholder="e.g. Public Health Description"
              type="description"
              id="description"
              autoComplete="current-description"
              required
              fullWidth
              variant="outlined"
              color={descriptionError ? "error" : "primary"}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box>
          <FormLabel>Activity Type Prerequisite</FormLabel>
          <Autocomplete
            sx={{ width: "100%" }}
            multiple
            options={prerequisites}
            value={selectedPrerequisites}
            onChange={(event, newValue: any) =>
              setSelectedPrerequisites(newValue)
            }
            getOptionLabel={(option) => option.name || ""}
            defaultValue={[]}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
        >
          {isLoading ? "Creating New Activity Type..." : "Create New Activity Type"}
        </Button>
      </Box>
    </Card>
  );
}

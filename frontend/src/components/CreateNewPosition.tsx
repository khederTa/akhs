import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const CreateNewPosition = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidInput) {
      return;
    }

    const payload = {
      name,
      description,
    };

    setIsLoading(true);
    try {
      const res = await axios.post("/position", payload);
      if (res.status === 201) {
        navigate("/position"); // Redirect upon success
      }
    } catch (error) {
      console.error("Error creating position:", error);
      alert("An error occurred while creating the position.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    let isValid = true;
    if (!name || name.length === 0) {
      setNameError(true);
      setNameErrorMessage("Position Name is Required");
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
  };

  return (
    <Card variant="highlighted">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Create New Position
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
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <TextField
            error={nameError}
            helperText={nameErrorMessage}
            name="name"
            placeholder="e.g. Officer"
            id="name"
            required
            fullWidth
            variant="outlined"
            color={nameError ? "error" : "primary"}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <TextField
            error={descriptionError}
            helperText={descriptionErrorMessage}
            name="description"
            placeholder="e.g. Responsible for management"
            id="description"
            required
            fullWidth
            variant="outlined"
            color={descriptionError ? "error" : "primary"}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
        >
          {isLoading ? "Creating New Position..." : "Create New Position"}
        </Button>
      </Box>
    </Card>
  );
};

export default CreateNewPosition;

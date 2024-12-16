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
import { useTranslation } from "react-i18next";

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

const CreateNewDepartment = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
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
      const res = await axios.post("/department", payload);
      console.log(res);
      if (res.status === 200) {
        navigate("/departments"); // Redirect upon success
      }
    } catch (error) {
      console.error("Error creating department:", error);
      // alert("An error occurred while creating the department.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    let isValid = true;
    if (!name || name.length === 0) {
      setNameError(true);
      setNameErrorMessage("department name is required");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!description || description.length === 0) {
      setDescriptionError(true);
      setDescriptionErrorMessage("description field is required");
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
        {t("create new department")}
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
          <FormLabel htmlFor="name">{t("name")}</FormLabel>
          <TextField
            error={nameError}
            helperText={t(nameErrorMessage)}
            name="name"
            placeholder={t("human resources")}
            id="name"
            required
            fullWidth
            variant="outlined"
            color={nameError ? "error" : "primary"}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description">{t("description")}</FormLabel>
          <TextField
            error={descriptionError}
            helperText={t(descriptionErrorMessage)}
            name="description"
            placeholder={t("human resources description")}
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
          {isLoading ? t("creating new department") : t("create new department")}
        </Button>
      </Box>
    </Card>
  );
};

export default CreateNewDepartment;

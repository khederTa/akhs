import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import axios from "../utils/axios"

import {
  Typography,
  Box,
  FormControl,
  FormLabel,
  TextField,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
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

export function CreateNewUser() {
  const [fnameError, setFnameError] = useState(false);
  const [fnameErrorMessage, setFnameErrorMessage] = useState("");
  const [lnameError, setLnameError] = useState(false);
  const [lnameErrorMessage, setLnameErrorMessage] = useState("");
  const [mnameError, setMnameError] = useState(false);
  const [mnameErrorMessage, setMnameErrorMessage] = useState("");
  const [studyError, setStudyError] = useState(false);
  const [studyErrorMessage, setStudyErrorMessage] = useState("");
  const [workError, setWorkError] = useState(false);
  const [workErrorMessage, setWorkErrorMessage] = useState("");
  const [gender, setGender] = useState("");
  const [genderMessage, setGenderMessage] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [cityError, setCityError] = useState(false);
  const [cityErrorMessage, setCityErrorMessage] = useState("");
  const [streetError, setStreetError] = useState(false);
  const [streetErrorMessage, setStreetErrorMessage] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const navigate = useNavigate();

  const handleChangePosition = (event: SelectChangeEvent) => {
    setPosition(event.target.value as string);
  };

  const handleChangeRole = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };
  const handleChangeDepartment = (event: SelectChangeEvent) => {
    setDepartment(event.target.value as string);
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIsLoading(true);
    const email = data.get("email") as string;
    const fname = data.get("fname") as string;
    const lname = data.get("lname") as string;
    const mname = data.get("mname") as string;
    const gender = data.get("gender") as string;
    const birthDate = data.get("birthDate") as string;
    const study = data.get("study") as string;
    const work = data.get("work") as string;
    const city = data.get("city") as string;
    const street = data.get("street") as string;
    const phone = data.get("phone") as string;
    const password = data.get("password") as string ; 


    

    try {
      const payload = {
        personData: {
          fname,
          lname,
          mname,
          phone,
          email,
          bDate: birthDate,
          gender,
          study,
          work,
          address: {
            city,
            street,
          },
        },
        departmentData: {
          name : department
          
        },
        roleData : {
          role : role
        },
        userData: {
          
          password,
          position
        },
      };

      // Send the data to the API via Axios POST request
      const response = await axios.post("/users", payload);

      if (response.status === 201) {
        console.log("serviceprovider created successfully:", response.data);
        navigate("/"); // Redirect upon success
      }
    } catch (error) {
      console.error("Error creating serviceprovider:", error);
      alert("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };
  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <Card variant="highlighted">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Create New User
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
        <FormControl sx={{ flex: 1 }}>
          <FormLabel htmlFor="fname">First Name</FormLabel>
          <TextField
            error={fnameError}
            helperText={fnameErrorMessage}
            id="fname"
            type="text"
            name="fname"
            placeholder="John"
            autoComplete="fname"
            required
            fullWidth
            variant="outlined"
            autoFocus
            color={fnameError ? "error" : "primary"}
          />
        </FormControl>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="mname">Middle Name</FormLabel>
            <TextField
              error={mnameError}
              helperText={mnameErrorMessage}
              id="mname"
              type="text"
              name="mname"
              placeholder="Adam"
              autoComplete="mname"
              required
              fullWidth
              variant="outlined"
              color={mnameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="lname">Last Name</FormLabel>
            <TextField
              error={lnameError}
              helperText={lnameErrorMessage}
              id="lname"
              type="text"
              name="lname"
              placeholder="Doe"
              autoComplete="lname"
              required
              fullWidth
              variant="outlined"
              color={lnameError ? "error" : "primary"}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="gender-label">Gender</FormLabel>
            <Select
              labelId="gender-label"
              id="gender"
              value={gender}
              sx={{
                backgroundColor: "var(--template-palette-background-default) !important",
              }}
              onChange={(e) => setGender(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="male" selected>
                Male
              </MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="birthDate">Birth Date</FormLabel>
            <TextField
              id="birthDate"
              type="date"
              name="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              helperText={passwordErrorMessage}
              fullWidth
              required
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="study">Study</FormLabel>
            <TextField
              error={studyError}
              helperText={studyErrorMessage}
              id="study"
              type="text"
              name="study"
              placeholder="e.g. Software Engineering"
              autoComplete="study"
              required
              fullWidth
              variant="outlined"
              color={studyError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="work">Work</FormLabel>
            <TextField
              error={workError}
              helperText={workErrorMessage}
              id="work"
              type="text"
              name="work"
              placeholder="e.g. Software Developer"
              autoComplete="work"
              required
              fullWidth
              variant="outlined"
              color={workError ? "error" : "primary"}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="city">City</FormLabel>
            <TextField
              error={cityError}
              helperText={cityErrorMessage}
              id="city"
              type="text"
              name="city"
              placeholder="e.g. Salamieh"
              autoComplete="city"
              required
              fullWidth
              variant="outlined"
              color={cityError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="street">Street</FormLabel>
            <TextField
              error={streetError}
              helperText={streetErrorMessage}
              id="street"
              type="text"
              name="street"
              placeholder="e.g. Al Thawra Street"
              autoComplete="street"
              required
              fullWidth
              variant="outlined"
              color={streetError ? "error" : "primary"}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="position">Position</FormLabel>
            <Select
            
          labelId="position"
          id="position"
          value={position}
          
          onChange={handleChangePosition}
        >
          <MenuItem value= "serviceprovider">serviceprovider</MenuItem>
          <MenuItem value= "trainer">trainer</MenuItem>
          
        </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="Role">Role</FormLabel>
            <Select
          labelId="Role"
          id="Role"
          value={role}
          label="Role"
          onChange={handleChangeRole}
        >
          <MenuItem value="admin">admin</MenuItem>
          <MenuItem value="user">user</MenuItem>
          
        </Select>
          </FormControl>
        </Box>
        <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="Department">Depratment</FormLabel>
            <Select
          labelId="Department"
          id="Department"
          value={department}
          label="Department"
          onChange={handleChangeDepartment}
        >
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="Communication">Communication</MenuItem>
          
        </Select>
          </FormControl>

        <FormControl>
          <FormLabel htmlFor="phone">Phone</FormLabel>
          <TextField
            error={phoneError}
            helperText={phoneErrorMessage}
            name="phone"
            placeholder="0988776655"
            type="phone"
            id="phone"
            autoComplete="current-phone"
            required
            fullWidth
            variant="outlined"
            color={phoneError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            name="email"
            placeholder="example@akhs.com"
            type="email"
            id="email"
            autoComplete="current-email"
            required
            fullWidth
            variant="outlined"
            color={emailError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
        >
          {isLoading ? "Creating New User..." : "Create New User"}
        </Button>
      </Box>
    </Card>
  );
}

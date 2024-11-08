/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";

import {
  Typography,
  Box,
  FormControl,
  FormLabel,
  TextField,
  Button,
  MenuItem,
  Checkbox,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import Address from "./Address";
import axios from "../utils/axios";

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

const ServiceProviderInfo = () => {
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
  const [roleError, setRoleError] = React.useState(false);
  const [roleErrorMessage, setRoleErrorMessage] = React.useState("");
  const [positionError, setPositionError] = React.useState(false);
  const [positionErrorMessage, setPositionErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = React.useState("");
  const [position, setPosition] = React.useState("");

  const [compSkill, setCompSkill] = useState("No");
  const [koboSkill, setKoboSkill] = useState("No");
  const [addressId, setAddressId] = useState<number | null>(null);
  const [prevVol, setPrevVol] = useState("No");
  const [smoking, setSmoking] = useState("No");
  const [fileId, setFileId] = useState<number | null>(null);

  const [departments, setDepartments] = useState<any>([{}]);
  const [positions, setPositions] = useState<any>([{}]);


  

  const navigate = useNavigate();
  // Initialize departments and positions with default values if empty
  const departmentOptions = useMemo(
    () =>
      departments.length > 0
        ? departments.map((department: any) => ({
            label: department.name,
            id: department.id,
          }))
        : [{ label: "No Departments Available", id: null }],
    [departments]
  );

  const positionOptions = useMemo(
    () =>
      positions.length > 0
        ? positions.map((position: any) => ({
            label: position.name,
            id: position.id,
          }))
        : [{ label: "No Positions Available", id: null }],
    [positions]
  );
  // console.log("departmenoptions is", departmentOptions);
  //fetch departments and position
  useEffect(() => {
    async function fetchDepartment() {
      const res = await axios.get("department");
      if (res.status === 200) {
        setDepartments(res.data);
        // console.log("departments", departments);
      }
    }
    async function fetchPosition() {
      const res = await axios.get("position");
      if (res.status === 200) {
        setPositions(res.data);
        // console.log("positions", positions);
      }
    }
    fetchPosition();

    fetchDepartment();
  }, [departments, positions]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIsLoading(true);
    // const email = data.get("email") as string;
    // const fname = data.get("fname") as string;
    // const lname = data.get("lname") as string;
    // const mname = data.get("mname") as string;
    const gender = data.get("gender") as string;
    // const birthDate = data.get("birthDate") as string;
    // const study = data.get("study") as string;
    // const work = data.get("work") as string;
    // const city = data.get("city") as string;
    // const street = data.get("street") as string;
    // const phone = data.get("phone") as string;
    const selectedDepartment = departmentOptions.filter((depOption: any) => {
      if (depOption.label === department) return depOption;
    });
const sendedDepartmentId = selectedDepartment?.[0]?.id || null

const selectedPosition = positionOptions.filter((posOption :any)=>{
  if(posOption.label === position) return posOption;
})
const sendedPositionId = selectedPosition?.[0].id || null

    // console.log("selected department"  , selectedDepartment)
    // console.log("selected department ID"  , sendedDepartmentId)
    try {
      const payload = {
        personData: {
          fname: data.get("fname"),
          lname: data.get("lname"),
          mname: data.get("mname"),
          momname: data.get("momname"),
          phone: data.get("phone"),
          email: data.get("email"),
          bDate: data.get("birthDate"),
          gender,
          study: data.get("study"),
          work: data.get("work"),
          compSkill,
          koboSkill,
          prevVol,
          smoking,
          nationalNumber: data.get("nationalNumber"),
          note: data.get("note"),
          fixPhone: data.get("fixPhone"),
          fileId,
          addressId,
        },
        serviceProviderData: {
          departmentId : sendedDepartmentId ,
          positionId : sendedPositionId , 
        },
      };

      // Send the data to the API via Axios POST request
      const response = await axios.post("/serviceprovider", payload);
      console.log(response.status)
      if (response.status === 201) {
        // console.log("serviceprovider created successfully:", response.data);
        navigate("/serviceprovider"); // Redirect upon success
      }
    } catch (error) {
      console.error("Error creating serviceprovider:", error);
      alert("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  
  // console.log("department is", department);
  // console.log("departmentId is", departmentId);
  return (
    <Card variant="highlighted">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Create New ServiceProvider
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
            // required
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
              // required
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
              // required
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
              name="gender"
              value={gender}
              sx={{
                backgroundColor:
                  "var(--template-palette-background-default) !important",
              }}
              onChange={(e) => setGender(e.target.value)}
              fullWidth
              // required
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
              fullWidth
              // required
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
              // required
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
              // required
              fullWidth
              variant="outlined"
              color={workError ? "error" : "primary"}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="city">National Number</FormLabel>
            <TextField
              error={cityError}
              helperText={cityErrorMessage}
              id="nationalNumber"
              type="text"
              name="nationalNumber"
              placeholder="050500000"
              autoComplete="nationalNumber"
              // required
              fullWidth
              variant="outlined"
              color={cityError ? "error" : "primary"}
            />
          </FormControl>

          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="street">Fix Phone</FormLabel>
            <TextField
              error={streetError}
              helperText={streetErrorMessage}
              id="fixPhone"
              type="text"
              name="fixPhone"
              placeholder="033888888"
              autoComplete="fixPhone"
              // required
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
              onChange={(e) => setPosition(e.target.value)}
            >
               {positionOptions?.map((positionoption: any) => (
                <MenuItem
                  key={positionoption.id}
                  value={positionoption.label}
                >
                  {positionoption.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="Department">Department</FormLabel>
            <Select
              labelId="Department"
              id="Department"
              value={department}
              label="Department"
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departmentOptions?.map((departmentoption: any) => (
                <MenuItem
                  key={departmentoption.id}
                  value={departmentoption.label}
                >
                  {departmentoption.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

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
        <FormControl
          sx={{ flex: 1, minWidth: "20%", maxWidth: "calc(50% - 8px)" }}
        >
          <FormLabel htmlFor="prevVol">
            Do you have experience in volunteer work previously or currently?
          </FormLabel>
          <Select
            labelId="prevVol"
            id="prevVol"
            value={prevVol}
            sx={{
              backgroundColor:
                "var(--template-palette-background-default) !important",
            }}
            label="prevVol"
            onChange={(event: SelectChangeEvent) => {
              setPrevVol(event.target.value as string);
            }}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          sx={{ flex: 1, minWidth: "20%", maxWidth: "calc(50% - 8px)" }}
        >
          <FormLabel htmlFor="compSkill">
            Do you have skills in Microsoft Office Programs?
          </FormLabel>
          <Select
            labelId="compSkill"
            id="compSkill"
            value={compSkill}
            sx={{
              backgroundColor:
                "var(--template-palette-background-default) !important",
            }}
            label="compSkill"
            onChange={(event: SelectChangeEvent) => {
              setCompSkill(event.target.value as string);
            }}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          sx={{ flex: 1, minWidth: "20%", maxWidth: "calc(50% - 8px)" }}
        >
          <FormLabel htmlFor="koboSkill">
            Do you have experience using the Kobo data collection tool?
          </FormLabel>
          <Select
            labelId="koboSkill"
            id="koboSkill"
            value={koboSkill}
            sx={{
              backgroundColor:
                "var(--template-palette-background-default) !important",
            }}
            label="koboSkill"
            onChange={(event: SelectChangeEvent) => {
              setKoboSkill(event.target.value as string);
            }}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="momname">mother name</FormLabel>
            <TextField
              error={workError}
              helperText={workErrorMessage}
              id="momname"
              type="text"
              name="momname"
              placeholder="mother name"
              autoComplete="momname"
              // required
              fullWidth
              variant="outlined"
              color={workError ? "error" : "primary"}
            />
          </FormControl>





          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="note">Notes</FormLabel>
            <TextField
              error={workError}
              helperText={workErrorMessage}
              id="note"
              type="text"
              name="note"
              placeholder="Notes"
              autoComplete="note"
              // required
              fullWidth
              variant="outlined"
              color={workError ? "error" : "primary"}
            />
          </FormControl>


        <FormControl
          sx={{ flex: 1, minWidth: "20%", maxWidth: "calc(50% - 8px)" }}
        >
          <FormLabel htmlFor="smoking">
            Are you a smoker / hookah, cigaretet?
          </FormLabel>
          <Select
            labelId="smoking"
            id="smoking"
            value={smoking}
            sx={{
              backgroundColor:
                "var(--template-palette-background-default) !important",
            }}
            label="smoking"
            onChange={(event: SelectChangeEvent) => {
              setSmoking(event.target.value as string);
            }}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <FileUpload fileId={fileId} setFileId={setFileId} />
        </FormControl>
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Address setAddressId={setAddressId} />
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          // onClick={validateInputs}
        >
          {isLoading
            ? "Creating New ServiceProvider..."
            : "Create New ServiceProvider"}
        </Button>
      </Box>
    </Card>
  );
};

export default ServiceProviderInfo;

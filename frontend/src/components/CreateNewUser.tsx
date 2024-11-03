/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
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
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import FileUpload from "./FileUpload";
import Address from "./Address";

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

type SelectItems = {
  id: number;
  name: string;
  description: string;
};

export function CreateNewUser() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mname, setMname] = useState("");
  const [momname, setMomname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [study, setStudy] = useState("");
  const [work, setWork] = useState("");
  const [gender, setGender] = useState("male");
  const [birthDate, setBirthDate] = useState("");
  const [fixPhone, setfixPhone] = useState("");
  const [nationalNumber, setNationalNumber] = useState("");
  const [note, setNote] = useState("");
  const [smoking, setSmoking] = useState("No");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("0");
  const [roles, setRoles] = useState<SelectItems[]>([]);
  const [position, setPosition] = useState("0");
  const [positions, setPositions] = useState<SelectItems[]>([]);
  const [department, setDepartment] = useState("0");
  const [departments, setDepartments] = useState([]);
  const [prevVol, setPrevVol] = useState("No");

  const [ynQuestion, setynQuestion] = useState([
    { id: "No", name: "No" },
    { id: "Yes", name: "Yes" },
  ]);

  const [compSkill, setCompSkill] = useState("No");
  const [koboSkill, setKoboSkill] = useState("No");

  const [fnameError, setFnameError] = useState(false);
  const [fnameErrorMessage, setFnameErrorMessage] = useState("");
  const [lnameError, setLnameError] = useState(false);
  const [lnameErrorMessage, setLnameErrorMessage] = useState("");
  const [mnameError, setMnameError] = useState(false);
  const [mnameErrorMessage, setMnameErrorMessage] = useState("");
  const [momnameError, setMomnameError] = useState(false);
  const [momnameErrorMessage, setMomnameErrorMessage] = useState("");
  const [studyError, setStudyError] = useState(false);
  const [studyErrorMessage, setStudyErrorMessage] = useState("");
  const [workError, setWorkError] = useState(false);
  const [workErrorMessage, setWorkErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [fixPhoneError, setFixPhoneError] = useState(false);
  const [fixPhoneErrorMessage, setFixPhoneErrorMessage] = useState("");
  const [nationalNumberError, setNationalNumberError] = useState(false);
  const [nationalNumberErrorMessage, setNationalNumberErrorMessage] =
    useState("");
  // const [noteError, setNoteError] = useState(false);
  // const [noteErrorMessage, setNoteErrorMessage] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [birthDateError, setBirthDateError] = useState(false);
  const [birthDateErrorMessage, setBirthDateErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidInput, setIsValidInput] = useState(false);
  const navigate = useNavigate();

  const [fileId, setFileId] = useState<number | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  useEffect(() => {
    console.log(fileId);
  }, [fileId]);
  useEffect(() => {
    console.log(addressId);
  }, [addressId]);

  useEffect(() => {
    async function fetchData() {
      await axios
        .get("/role")
        .then((res) => {
          const roleData = res.data;
          // setIsLoading(false);
          console.log(res);
          setRoles(roleData);
        })
        .catch((err) => {
          console.error(err);
        });
      await axios.get("/department").then((res) => {
        const departmentData = res.data;
        console.log(res);
        setDepartments(departmentData);
      });
      await axios.get("/position").then((res) => {
        const positionData = res.data;
        console.log(res);
        setPositions(positionData);
        setIsLoading(false);
      });
    }
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidInput) {
      return;
    }
    const data = new FormData(event.currentTarget);
    setIsLoading(true);
    const email = data.get("email") as string;
    const fname = data.get("fname") as string;
    const lname = data.get("lname") as string;
    const mname = data.get("mname") as string;
    const momname = data.get("momname") as string;
    // const gender = data.get("gender") as string;
    const birthDate = data.get("birthDate") as string;
    const study = data.get("study") as string;
    const work = data.get("work") as string;
    const nationalNumber = data.get("nationalNumber") as string;
    const phone = data.get("phone") as string;
    const password = data.get("password") as string;
    const note = data.get("note") as string;
    // const compSkill = data.get("compSkill") as string;
    // const prevVol = data.get("prevVol") as string;
    // const koboSkill = data.get("koboSkill") as string;
    try {
      const payload = {
        personData: {
          fname,
          lname,
          mname,
          momname,
          phone,
          email,
          bDate: birthDate,
          gender,
          study,
          work,
          nationalNumber,
          note,
          compSkill,
          smoking,
          fixPhone,
          prevVol,
          koboSkill,
          fileId,
          addressId,
        },
        volunteerData: {
          active_status: "active",
        },
        serviceProviderData: {
          departmentId: department,
          positionId: position,
        },
        userData: {
          password,
          position,
          roleId: role,
        },
      };
      console.log("payload: ");
      console.log(payload);
      // Send the data to the API via Axios POST request
      const response = await axios.post("/user", payload);

      if (response.status === 201) {
        console.log("serviceprovider created successfully:", response.data);
        navigate("/user-management"); // Redirect upon success
      }
    } catch (error) {
      console.error("Error creating serviceprovider:", error);
      alert("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };
  const validateInputs = () => {
    let isValid = true;

    if (!fname || fname.length === 0) {
      setFnameError(true);
      setFnameErrorMessage("First Name is Required!");
    } else {
      setFnameError(false);
      setFnameErrorMessage("");
    }
    if (!mname || mname.length === 0) {
      setMnameError(true);
      setMnameErrorMessage("Middle Name is Required!");
    } else {
      setMnameError(false);
      setMnameErrorMessage("");
    }
    if (!momname || momname.length === 0) {
      setMomnameError(true);
      setMomnameErrorMessage("Mother Name is Required!");
    } else {
      setMnameError(false);
      setMnameErrorMessage("");
    }
    if (!lname || lname.length === 0) {
      setLnameError(true);
      setLnameErrorMessage("Last Name is Required!");
    } else {
      setLnameError(false);
      setLnameErrorMessage("");
    }

    if (!birthDate || birthDate.length === 0) {
      setBirthDateError(true);
      setBirthDateErrorMessage("Birth Date is Required!");
    } else {
      setBirthDateError(false);
      setBirthDateErrorMessage("");
    }
    if (!study || study.length === 0) {
      setStudyError(true);
      setStudyErrorMessage("Study is Required!");
    } else {
      setStudyError(false);
      setStudyErrorMessage("");
    }
    if (!work || work.length === 0) {
      setWorkError(true);
      setWorkErrorMessage("Work is Required!");
    } else {
      setWorkError(false);
      setWorkErrorMessage("");
    }
    if (!fixPhone || fixPhone.length === 0) {
      setFixPhoneError(true);
      setFixPhoneErrorMessage("Fix Phone is Required!");
    } else {
      setFixPhoneError(false);
      setFixPhoneErrorMessage("");
    }
    if (!nationalNumber || nationalNumber.length === 0) {
      setNationalNumberError(true);
      setNationalNumberErrorMessage("National Number is Required!");
    } else {
      setNationalNumberError(false);
      setNationalNumberErrorMessage("");
    }
    if (!phone || phone.length === 0) {
      setPhoneError(true);
      setPhoneErrorMessage("Phone is Required!");
    } else {
      setPhoneError(false);
      setPhoneErrorMessage("");
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
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
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="fname">First Name</FormLabel>
            <TextField
              required
              error={fnameError}
              helperText={fnameErrorMessage}
              id="fname"
              type="text"
              name="fname"
              placeholder="John"
              autoComplete="fname"
              fullWidth
              variant="outlined"
              autoFocus
              color={fnameError ? "error" : "primary"}
              onChange={(e) => setFname(e.target.value)}
            />
          </FormControl>
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
              onChange={(e) => setMname(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="momname">Mother Name</FormLabel>
            <TextField
              error={momnameError}
              helperText={momnameErrorMessage}
              id="momname"
              type="text"
              name="momname"
              placeholder="Sarah"
              autoComplete="momname"
              required
              fullWidth
              variant="outlined"
              color={momnameError ? "error" : "primary"}
              onChange={(e) => setMomname(e.target.value)}
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
              onChange={(e) => setLname(e.target.value)}
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
                backgroundColor:
                  "var(--template-palette-background-default) !important",
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
              error={birthDateError}
              helperText={birthDateErrorMessage}
              color={birthDateError ? "error" : "primary"}
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
              onChange={(e) => setStudy(e.target.value)}
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
              onChange={(e) => setWork(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="fixPhone">Fix Phone</FormLabel>
            <TextField
              error={fixPhoneError}
              helperText={fixPhoneErrorMessage}
              id="fixPhone"
              type="text"
              name="fixPhone"
              placeholder="e.g. 0996655445"
              autoComplete="fixPhone"
              required
              fullWidth
              variant="outlined"
              color={fixPhoneError ? "error" : "primary"}
              onChange={(e) => setfixPhone(e.target.value)}
            />
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
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="position">Position</FormLabel>
            <Select
              labelId="position"
              id="position"
              sx={{
                backgroundColor:
                  "var(--template-palette-background-default) !important",
              }}
              value={position}
              onChange={(event: SelectChangeEvent) => {
                setPosition(event.target.value as string);
              }}
            >
              {positions.map((item) => (
                <MenuItem key={`${item.id}-${item.name}`} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="Role">Role</FormLabel>
            <Select
              labelId="Role"
              id="Role"
              value={role}
              sx={{
                backgroundColor:
                  "var(--template-palette-background-default) !important",
              }}
              label="Role"
              onChange={(event: SelectChangeEvent) => {
                setRole(event.target.value as string);
              }}
            >
              {roles.map((item) => (
                <MenuItem key={`${item.id}-${item.name}`} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="Department">Depratment</FormLabel>
            <Select
              labelId="Department"
              id="Department"
              value={department}
              sx={{
                backgroundColor:
                  "var(--template-palette-background-default) !important",
              }}
              label="Department"
              onChange={(event: SelectChangeEvent) => {
                setDepartment(event.target.value as string);
              }}
            >
              {departments.map((item: { id: number; name: string }) => (
                <MenuItem key={`${item.id}-${item.name}`} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ flex: 1 }}>
            <FormLabel htmlFor="nationalNumber">National Number</FormLabel>
            <TextField
              error={nationalNumberError}
              helperText={nationalNumberErrorMessage}
              id="nationalNumber"
              type="text"
              name="nationalNumber"
              placeholder="e.g. 05050025256"
              autoComplete="nationalNumber"
              required
              fullWidth
              variant="outlined"
              color={nationalNumberError ? "error" : "primary"}
              onChange={(e) => setNationalNumber(e.target.value)}
            />
          </FormControl>
        </Box>
        <FormControl sx={{ flex: 1 }}>
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
            {ynQuestion.map((item: { id: string; name: string }) => (
              <MenuItem key={`${item.id}-${item.name}`} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
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
            {ynQuestion.map((item: { id: string; name: string }) => (
              <MenuItem key={`${item.id}-${item.name}`} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
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
            {ynQuestion.map((item: { id: string; name: string }) => (
              <MenuItem key={`${item.id}-${item.name}`} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
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
            {ynQuestion.map((item: { id: string; name: string }) => (
              <MenuItem key={`${item.id}-${item.name}`} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <PasswordInput
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            passwordError={passwordError}
            passwordErrorMessage={passwordErrorMessage}
          />
        </FormControl>
        <FormControl>
          <Address setAddressId={setAddressId} />
        </FormControl>
        <FormControl>
          <FileUpload fileId={fileId} setFileId={setFileId} />
        </FormControl>

        <FormControl sx={{ flex: 1 }}>
          <FormLabel htmlFor="note">Notes</FormLabel>
          <TextField
            // error={noteError}
            // helperText={noteErrorMessage}
            id="note"
            type="textarea"
            name="note"
            placeholder=""
            autoComplete="note"
            required
            fullWidth
            variant="outlined"
            // color={noteError ? "error" : "primary"}
            onChange={(e) => setNote(e.target.value)}
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

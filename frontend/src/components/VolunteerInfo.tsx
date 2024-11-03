import React, { useState } from "react";
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
  Select,
  Checkbox,
  SelectChangeEvent,
} from "@mui/material";
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
  maxWidth: "100%",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const VolunteerInfo = () => {
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
  const [fixPhoneError, setFixPhoneError] = useState(false);
  const [fixPhoneErrorMessage, setFixPhoneErrorMessage] = useState("");
  const [nationalNumberError, setNationalNumberError] = useState(false);
  const [nationalNumberErrorMessage, setNationalNumberErrorMessage] =
    useState("");
  const [momnameError, setMomnameError] = useState(false);
  const [momnameErrorMessage, setMomnameErrorMessage] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [active_status, setActive_status] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [prevVol, setPrevVol] = useState("No");
  const [smoking, setSmoking] = useState("No");
  const [fileId, setFileId] = useState<number | null>(null);

  // const [ynQuestion, setynQuestion] = useState([
  //   { id: "No", name: "No" },
  //   { id: "Yes", name: "Yes" },
  // ]);

  const [compSkill, setCompSkill] = useState("No");
  const [koboSkill, setKoboSkill] = useState("No");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);

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
      volunteerData: {
        active_status,
      },
    };
    console.log(payload)
    try {
      const response = await axios.post("/volunteer", payload);
      if (response.status === 201) {
        navigate("/volunteer");
      }
    } catch (error) {
      alert("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
    console.log("the payload data that we send is ", payload);
  };
  // console.log("kobovalue", koboSkill);
  // console.log("compskille", compSkill);
  // console.log("prevvol", prevVol);
  // console.log("nationalnumber");
  return (
    <Card variant="highlighted">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Create New Volunteer
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
          width: "100%",
        }}
      >
        {[
          {
            id: "fname",
            label: "First Name",
            placeholder: "John",
            error: fnameError,
            helperText: fnameErrorMessage,
          },
          {
            id: "mname",
            label: "Middle Name",
            placeholder: "Adam",
            error: mnameError,
            helperText: mnameErrorMessage,
          },
          {
            id: "lname",
            label: "Last Name",
            placeholder: "Doe",
            error: lnameError,
            helperText: lnameErrorMessage,
          },
          {
            id: "momname",
            label: "Mother Name",
            placeholder: "Jane",
            error: momnameError,
            helperText: momnameErrorMessage,
          },
          {
            id: "phone",
            label: "Phone",
            placeholder: "0988776655",
            error: phoneError,
            helperText: phoneErrorMessage,
          },
          {
            id: "email",
            label: "Email",
            placeholder: "example@akhs.com",
            error: emailError,
            helperText: emailErrorMessage,
          },
         
          {
            id: "study",
            label: "Study",
            placeholder: "e.g. Software Engineering",
            error: studyError,
            helperText: studyErrorMessage,
          },
          {
            id: "work",
            label: "Work",
            placeholder: "e.g. Software Developer",
            error: workError,
            helperText: workErrorMessage,
          },
          {
            id: "nationalNumber",
            label: "National Number",
            placeholder: "050500",
            error: nationalNumberError,
            helperText: nationalNumberErrorMessage,
          },
          {
            id: "fixPhone",
            label: "Fix Phone",
            placeholder: "0338800000",
            error: fixPhoneError,
            helperText: fixPhoneErrorMessage,
          },
          {
            id: "note",
            label: "Notes",
            placeholder: "add your notes",
            error: workError,
            helperText: workErrorMessage,
          },
        ].map(({ id, label, placeholder, error, helperText }) => (
          <FormControl
            sx={{ flex: 1, minWidth: "20%", maxWidth: "calc(50% - 8px)" }}
            key={id}
          >
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <TextField
              id={id}
              name={id}
              placeholder={placeholder}
              error={error}
              helperText={helperText}
              fullWidth
            />
          </FormControl>
        ))}

        <FormControl
          sx={{ flex: 1, minWidth: "20%", maxWidth: "calc(50% - 8px)" }}
        >
          <FormLabel htmlFor="gender">Gender</FormLabel>
          <Select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            fullWidth
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{ flex: 1, minWidth: "20%", maxWidth: "calc(50% - 8px)" }}
        >
          <FormLabel htmlFor="birthDate">Birth Date</FormLabel>
          <TextField
            id="birthDate"
            name="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            fullWidth
          />
        </FormControl>

        <FormControl>
          <FormLabel>Address</FormLabel>
          <Address setAddressId={setAddressId} />
        </FormControl>

        <FormControl
          sx={{ flex: 1, minWidth: "20%", maxWidth: "calc(50% - 8px)" }}
        >
          <FormLabel htmlFor="disable">Active Status</FormLabel>
          <Checkbox
            id="active_status"
            name="active_status"
            checked={active_status}
            onChange={(e) => setActive_status(e.target.checked)}
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
        <Button
          type="submit"
          variant="contained"
          sx={{ flex: "1 0 100%", mt: 2 }}
        >
          {isLoading ? "Creating New Volunteer..." : "Create New Volunteer"}
        </Button>
      </Box>
    </Card>
  );
};

export default VolunteerInfo;

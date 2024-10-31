// import React, { useState } from "react";
// import { styled } from "@mui/material/styles";
// import MuiCard from "@mui/material/Card";

// import {
//   Typography,
//   Box,
//   FormControl,
//   FormLabel,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   Checkbox,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "../utils/axios";

// const Card = styled(MuiCard)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignSelf: "center",
//   width: "100%",
//   padding: theme.spacing(4),
//   gap: theme.spacing(2),
//   margin: "auto",
//   [theme.breakpoints.up("sm")]: {
//     maxWidth: "500px",
//   },
//   boxShadow:
//     "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
//   ...theme.applyStyles("dark", {
//     boxShadow:
//       "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
//   }),
// }));

// const VolunteerInfo = () => {
//   const [fnameError, setFnameError] = useState(false);
//   const [fnameErrorMessage, setFnameErrorMessage] = useState("");
//   const [lnameError, setLnameError] = useState(false);
//   const [lnameErrorMessage, setLnameErrorMessage] = useState("");
//   const [mnameError, setMnameError] = useState(false);
//   const [mnameErrorMessage, setMnameErrorMessage] = useState("");
//   const [studyError, setStudyError] = useState(false);
//   const [studyErrorMessage, setStudyErrorMessage] = useState("");
//   const [workError, setWorkError] = useState(false);
//   const [workErrorMessage, setWorkErrorMessage] = useState("");
//   const [gender, setGender] = useState("");
//   const [genderMessage, setGenderMessage] = useState("");
//   const [birthDate, setBirthDate] = useState("");
//   const [passwordError, setPasswordError] = useState(false);
//   const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
//   const [cityError, setCityError] = useState(false);
//   const [cityErrorMessage, setCityErrorMessage] = useState("");
//   const [streetError, setStreetError] = useState(false);
//   const [streetErrorMessage, setStreetErrorMessage] = useState("");
//   const [phoneError, setPhoneError] = useState(false);
//   const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
//   const [emailError, setEmailError] = React.useState(false);
//   const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
//   const [disableError, setDisableError] = React.useState(false);
//   const [disableErrorMessage, setDisableErrorMessage] = React.useState("");
//   const [disable_statusError, setDisable_statusError] = React.useState(false);
//   const [disable_statusErrorMessage, setDisable_statusErrorMessage] =
//     React.useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [disable, setDisable] = useState(false); // Add state to manage checkbox value
//   const navigate = useNavigate();

//   const label = { inputProps: { "aria-label": "Checkbox demo" } };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     setIsLoading(true);
//     const email = data.get("email") as string;
//     const fname = data.get("fname") as string;
//     const lname = data.get("lname") as string;
//     const mname = data.get("mname") as string;
//     const gender = data.get("gender") as string;
//     const birthDate = data.get("birthDate") as string;
//     const study = data.get("study") as string;
//     const work = data.get("work") as string;
//     const city = data.get("city") as string;
//     const street = data.get("street") as string;
//     const phone = data.get("phone") as string;

//     const disable_status = data.get("disable_status") as string;

//     try {
//       const payload = {
//         personData: {
//           fname,
//           lname,
//           mname,
//           phone,
//           email,
//           bDate: birthDate,
//           gender,
//           study,
//           work,
//           address: {
//             city,
//             street,
//           },
//         },
//         volunteerData: {
//           disable,
//           disable_status,
//         },
//       };

//       // Send the data to the API via Axios POST request
//       const response = await axios.post("/volunteers", payload);

//       if (response.status === 201) {
//         console.log("Volunteer created successfully:", response.data);
//         navigate("/"); // Redirect upon success
//       }
//     } catch (error) {
//       console.error("Error creating volunteer:", error);
//       alert("An error occurred while submitting the form.");
//     } finally {
//       setIsLoading(false); // Stop loading state
//     }
//   };

//   // const validateInputs = () => {
//   //   const email = document.getElementById("email") as HTMLInputElement;
//   //   const password = document.getElementById("password") as HTMLInputElement;

//   //   let isValid = true;

//   //   if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
//   //     setEmailError(true);
//   //     setEmailErrorMessage("Please enter a valid email address.");
//   //     isValid = false;
//   //   } else {
//   //     setEmailError(false);
//   //     setEmailErrorMessage("");
//   //   }

//   //   if (!password.value || password.value.length < 6) {
//   //     setPasswordError(true);
//   //     setPasswordErrorMessage("Password must be at least 6 characters long.");
//   //     isValid = false;
//   //   } else {
//   //     setPasswordError(false);
//   //     setPasswordErrorMessage("");
//   //   }

//   //   return isValid;
//   // };

//   return (
//     <Card variant="highlighted">
//       <Typography
//         component="h1"
//         variant="h4"
//         sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
//       >
//         Create New Volunteer
//       </Typography>
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         noValidate
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",
//           gap: 2,
//         }}
//       >
//         <FormControl sx={{ flex: 1 }}>
//           <FormLabel htmlFor="fname">First Name</FormLabel>
//           <TextField
//             error={fnameError}
//             helperText={fnameErrorMessage}
//             id="fname"
//             type="text"
//             name="fname"
//             placeholder="John"
//             autoComplete="fname"
//             // required
//             fullWidth
//             variant="outlined"
//             autoFocus
//             color={fnameError ? "error" : "primary"}
//           />
//         </FormControl>
//         <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
//           <FormControl sx={{ flex: 1 }}>
//             <FormLabel htmlFor="mname">Middle Name</FormLabel>
//             <TextField
//               error={mnameError}
//               helperText={mnameErrorMessage}
//               id="mname"
//               type="text"
//               name="mname"
//               placeholder="Adam"
//               autoComplete="mname"
//               // required
//               fullWidth
//               variant="outlined"
//               color={mnameError ? "error" : "primary"}
//             />
//           </FormControl>
//           <FormControl sx={{ flex: 1 }}>
//             <FormLabel htmlFor="lname">Last Name</FormLabel>
//             <TextField
//               error={lnameError}
//               helperText={lnameErrorMessage}
//               id="lname"
//               type="text"
//               name="lname"
//               placeholder="Doe"
//               autoComplete="lname"
//               // required
//               fullWidth
//               variant="outlined"
//               color={lnameError ? "error" : "primary"}
//             />
//           </FormControl>
//         </Box>
//         <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
//           <FormControl sx={{ flex: 1 }}>
//             <FormLabel htmlFor="gender-label">Gender</FormLabel>
//             <Select
//               labelId="gender-label"
//               id="gender"
//               name="gender"
//               value={gender}
//               sx={{
//                 backgroundColor:
//                   "var(--template-palette-background-default) !important",
//               }}
//               onChange={(e) => setGender(e.target.value)}
//               fullWidth
//               // required
//             >
//               <MenuItem value="male" selected>
//                 Male
//               </MenuItem>
//               <MenuItem value="female">Female</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl sx={{ flex: 1 }}>
//             <FormLabel htmlFor="birthDate">Birth Date</FormLabel>
//             <TextField
//               id="birthDate"
//               type="date"
//               name="birthDate"
//               value={birthDate}
//               onChange={(e) => setBirthDate(e.target.value)}
//               fullWidth
//               // required
//             />
//           </FormControl>
//         </Box>
//         <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
//           <FormControl sx={{ flex: 1 }}>
//             <FormLabel htmlFor="study">Study</FormLabel>
//             <TextField
//               error={studyError}
//               helperText={studyErrorMessage}
//               id="study"
//               type="text"
//               name="study"
//               placeholder="e.g. Software Engineering"
//               autoComplete="study"
//               // required
//               fullWidth
//               variant="outlined"
//               color={studyError ? "error" : "primary"}
//             />
//           </FormControl>
//           <FormControl sx={{ flex: 1 }}>
//             <FormLabel htmlFor="work">Work</FormLabel>
//             <TextField
//               error={workError}
//               helperText={workErrorMessage}
//               id="work"
//               type="text"
//               name="work"
//               placeholder="e.g. Software Developer"
//               autoComplete="work"
//               // required
//               fullWidth
//               variant="outlined"
//               color={workError ? "error" : "primary"}
//             />
//           </FormControl>
//         </Box>
//         <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
//           <FormControl sx={{ flex: 1 }}>
//             <FormLabel htmlFor="city">City</FormLabel>
//             <TextField
//               error={cityError}
//               helperText={cityErrorMessage}
//               id="city"
//               type="text"
//               name="city"
//               placeholder="e.g. Salamieh"
//               autoComplete="city"
//               // required
//               fullWidth
//               variant="outlined"
//               color={cityError ? "error" : "primary"}
//             />
//           </FormControl>
//           <FormControl sx={{ flex: 1 }}>
//             <FormLabel htmlFor="street">Street</FormLabel>
//             <TextField
//               error={streetError}
//               helperText={streetErrorMessage}
//               id="street"
//               type="text"
//               name="street"
//               placeholder="e.g. Al Thawra Street"
//               autoComplete="street"
//               // required
//               fullWidth
//               variant="outlined"
//               color={streetError ? "error" : "primary"}
//             />
//           </FormControl>
//         </Box>
//         <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
//           <FormControl sx={{ flex: 1 }}>
//             <FormLabel htmlFor="disable">disable</FormLabel>
//             <Checkbox
//               // onError={disableError}
//               // helperText={disableErrorMessage}
//               id="disable"
//               // type="checkbox"
//               name="disable"
//               checked={disable} // Bind state to checked property
//               onChange={(e) => setDisable(e.target.checked)} // Update state on change
//               // placeholder="e.g. Software Engineering"
//               // autoComplete="study"
//               // required
//               // fullWidth
//               // variant="outlined"
//               // color={disableError ? "error" : "primary"}
//             />
//           </FormControl>
//           <FormControl sx={{ flex: 1 }}>
//             <FormLabel htmlFor="disable_status">disable_status</FormLabel>
//             <TextField
//               error={disable_statusError}
//               helperText={disable_statusErrorMessage}
//               id="disable_status"
//               type="text"
//               name="disable_status"
//               // placeholder="e.g. Software Developer"
//               // autoComplete="work"
//               // required
//               fullWidth
//               variant="outlined"
//               color={disable_statusError ? "error" : "primary"}
//             />
//           </FormControl>
//         </Box>

//         <FormControl>
//           <FormLabel htmlFor="phone">Phone</FormLabel>
//           <TextField
//             error={phoneError}
//             helperText={phoneErrorMessage}
//             name="phone"
//             placeholder="0988776655"
//             type="phone"
//             id="phone"
//             autoComplete="current-phone"
//             required
//             fullWidth
//             variant="outlined"
//             color={phoneError ? "error" : "primary"}
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel htmlFor="email">Email</FormLabel>
//           <TextField
//             error={emailError}
//             helperText={emailErrorMessage}
//             name="email"
//             placeholder="example@akhs.com"
//             type="email"
//             id="email"
//             autoComplete="current-email"
//             required
//             fullWidth
//             variant="outlined"
//             color={emailError ? "error" : "primary"}
//           />
//         </FormControl>

//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           // onClick={validateInputs}
//         >
//           {isLoading ? "Creating New Volunteer..." : "Create New Volunteer"}
//         </Button>
//       </Box>
//     </Card>
//   );
// };

// export default VolunteerInfo;
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
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [cityError, setCityError] = useState(false);
  const [cityErrorMessage, setCityErrorMessage] = useState("");
  const [streetError, setStreetError] = useState(false);
  const [streetErrorMessage, setStreetErrorMessage] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [disableError, setDisableError] = useState(false);
  const [disableErrorMessage, setDisableErrorMessage] = useState("");
  const [disable_statusError, setDisable_statusError] = useState(false);
  const [disable_statusErrorMessage, setDisable_statusErrorMessage] =
    useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);

    const payload = {
      addressData: {
        city: data.get("city"),
          street: data.get("street"),
      },
      personData: {
        fname: data.get("fname"),
        lname: data.get("lname"),
        mname: data.get("mname"),
        phone: data.get("phone"),
        email: data.get("email"),
        bDate: data.get("birthDate"),
        gender: data.get("gender"),
        study: data.get("study"),
        work: data.get("work"),
        
      },
      volunteerData: {
        disable,
        disable_status: data.get("disable_status"),
      },
    };

    try {
      const response = await axios.post("/volunteer", payload);
      if (response.status === 201) {
        navigate("/");
      }
    } catch (error) {
      alert("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <FormLabel >Address</FormLabel>
          <Address setAddressId={setAddressId} />
        </FormControl>


        <FormControl
          sx={{ flex: 1, minWidth: "20%", maxWidth: "calc(50% - 8px)" }}
        >
          <FormLabel htmlFor="disable">Disable</FormLabel>
          <Checkbox
            id="disable"
            name="disable"
            checked={disable}
            onChange={(e) => setDisable(e.target.checked)}
          />
        </FormControl>

        <FormControl
          sx={{ flex: 1, minWidth: "20%", maxWidth: "calc(50% - 8px)" }}
        >
          <FormLabel htmlFor="disable_status">Disable Status</FormLabel>
          <TextField
            id="disable_status"
            name="disable_status"
            error={disable_statusError}
            helperText={disable_statusErrorMessage}
            fullWidth
          />
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

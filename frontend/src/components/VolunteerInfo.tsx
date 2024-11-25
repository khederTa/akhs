/* eslint-disable @typescript-eslint/no-explicit-any */
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
  RadioGroup,
  Radio,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import Address from "./Address";
import axios from "../utils/axios";
import { useTranslation } from "react-i18next";

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
  const [gender, setGender] = useState("Male");
  const [birthDate, setBirthDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [prevVol, setPrevVol] = useState("No");
  const [smoking, setSmoking] = useState("No");
  const [fileId, setFileId] = useState<number | null>(null);
  const [compSkill, setCompSkill] = useState("No");
  const [koboSkill, setKoboSkill] = useState("No");
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const validateForm = () => {
    const newErrors: any = {};
    if (!gender) newErrors.gender = t("gender is required");
    if (!birthDate) newErrors.birthDate = t("birth date is required");
    if (!prevVol)
      newErrors.prevVol = t("previous volunteer experience is required");
    if (!compSkill)
      newErrors.compSkill = t("microsoft office skills is required");
    if (!smoking) newErrors.smoking = t("smoking status is required");
    if (!koboSkill) newErrors.koboSkill = t("kobo tool experience is required");
    // if (!fileId) newErrors.fileId = t("file upload is required");
    if (!addressId) newErrors.addressId = t("address is required");

    // Validate required text fields
    [
      "fname",
      "lname",
      "phone",
      "email",
      "nationalNumber",
      "phone",
      "fixPhone",
    ].forEach((field) => {
      const value = (
        document.querySelector(`[name=${field}]`) as HTMLInputElement
      )?.value;
      if (!value) {
        newErrors[field] = t(`${field} is required`);
      }
    });

    // Validate email
    const email = (document.querySelector(`[name=email]`) as HTMLInputElement)
      ?.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !email.match(emailPattern))
      newErrors.email = t("invalid email address");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

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
        active_status: "active",
      },
    };

    try {
      const response = await axios.post("/volunteer", payload);
      if (response.status === 201) {
        navigate("/volunteer");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="highlighted">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}
      >
        {t("create new volunteer")}
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
            label: t("fname"),
            placeholder: t("John"),
          },
          {
            id: "mname",
            label: t("mname"),
            placeholder: t("Adam"),
          },
          {
            id: "lname",
            label: t("lname"),
            placeholder: t("Doe"),
          },
          {
            id: "momname",
            label: t("momName"),
            placeholder: t("Jane"),
          },
          {
            id: "phone",
            label: t("phone"),
            placeholder: "0988776655",
          },
          {
            id: "email",
            label: t("email"),
            placeholder: "example@akhs.com",
          },
          {
            id: "study",
            label: t("study"),
            placeholder: t("software engineering"),
          },
          {
            id: "work",
            label: t("work"),
            placeholder: t("software developer"),
          },
          {
            id: "nationalNumber",
            label: t("nationalNumber"),
            placeholder: "050500",
          },
          {
            id: "fixPhone",
            label: t("fixPhone"),
            placeholder: "0338800000",
          },
        ].map(({ id, label, placeholder }) => (
          <FormControl
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 30%" },
              minWidth: "20%",
            }}
            key={id}
            error={!!errors[id]}
          >
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <TextField
              id={id}
              name={id}
              placeholder={placeholder}
              fullWidth
              error={!!errors[id]}
            />
            {errors[id] && <FormHelperText>{errors[id]}</FormHelperText>}
          </FormControl>
        ))}

        <FormControl
          sx={{ flex: { xs: "1 1 100%", md: "1 1 30%" } }}
          error={!!errors.birthDate}
        >
          <FormLabel htmlFor="birthDate">{t("birth date")}</FormLabel>
          <TextField
            id="birthDate"
            name="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            fullWidth
            error={!!errors.birthDate}
          />
          {errors.birthDate && (
            <FormHelperText>{errors.birthDate}</FormHelperText>
          )}
        </FormControl>
        <FormControl
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 30%" },
            minWidth: "20%",
          }}
          key={"note"}
          error={!!errors["note"]}
        >
          <FormLabel htmlFor={"note"}>{t("notes")}</FormLabel>
          <TextField
            id={"note"}
            name={"note"}
            placeholder={t("add your notes")}
            fullWidth
            error={!!errors["note"]}
          />
          {errors["note"] && <FormHelperText>{errors["note"]}</FormHelperText>}
        </FormControl>
        <FormControl
          component="fieldset"
          sx={{ flex: "1 1 40%" }}
          error={!!errors.addressId}
        >
          <FormLabel>{t("address")}</FormLabel>
          <Address setAddressId={setAddressId} />
          {errors.addressId && (
            <FormHelperText>{errors.addressId}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          component="fieldset"
          sx={{ flex: "1 1 100%" }}
          error={!!errors.gender}
        >
          <FormLabel component="legend">{t("gender")}</FormLabel>
          <RadioGroup
            row
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel value="Male" control={<Radio />} label={t("male")} />
            <FormControlLabel
              value="Female"
              control={<Radio />}
              label={t("female")}
            />
          </RadioGroup>
          {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
        </FormControl>

        <FormControl component="fieldset" sx={{ flex: "1 1 100%" }}>
          <FormLabel component="legend">
            {t("do you have past or current volunteer experience?")}
          </FormLabel>
          <RadioGroup
            row
            value={prevVol}
            onChange={(e) => setPrevVol(e.target.value)}
          >
            <FormControlLabel value="Yes" control={<Radio />} label={t("yes")} />
            <FormControlLabel value="No" control={<Radio />} label={t("no")} />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" sx={{ flex: "1 1 100%" }}>
          <FormLabel component="legend">
            {t("do you have skills in Microsoft Office Programs?")}
          </FormLabel>
          <RadioGroup
            row
            value={compSkill}
            onChange={(e) => setCompSkill(e.target.value)}
          >
            <FormControlLabel value="Yes" control={<Radio />} label={t("yes")} />
            <FormControlLabel value="No" control={<Radio />} label={t("no")} />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" sx={{ flex: "1 1 100%" }}>
          <FormLabel component="legend">
            {t("are you a smoker / hookah, cigarette?")}
          </FormLabel>
          <RadioGroup
            row
            value={smoking}
            onChange={(e) => setSmoking(e.target.value)}
          >
            <FormControlLabel value="Yes" control={<Radio />} label={t("yes")} />
            <FormControlLabel value="No" control={<Radio />} label={t("no")} />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ flex: "1 1 100%" }}>
          <FormLabel component="legend">
            {t("have you used the Kobo data tool?")}
          </FormLabel>
          <RadioGroup
            row
            value={koboSkill}
            onChange={(e) => setKoboSkill(e.target.value)}
          >
            <FormControlLabel value="Yes" control={<Radio />} label={t("yes")} />
            <FormControlLabel value="No" control={<Radio />} label={t("no")} />
          </RadioGroup>
        </FormControl>

        <FormControl
          error={!!errors.fileId}
          component="fieldset"
          sx={{ flex: "1 1 50%" }}
        >
          <FormLabel htmlFor="compSkill">{t("your resume")}</FormLabel>
          <FileUpload fileId={fileId} setFileId={setFileId} />
          {errors.fileId && <FormHelperText>{errors.fileId}</FormHelperText>}
        </FormControl>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{ flex: "1 0 100%", mt: 2 }}
          >
            {isLoading
              ? t("creating new volunteer...")
              : t("create new volunteer")}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default VolunteerInfo;

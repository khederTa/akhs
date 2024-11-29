/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";

import {
  Typography,
  Box,
  FormControl,
  FormLabel,
  TextField,
  Button,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import Address from "./Address";
import axios from "../utils/axios";
import PasswordInput from "./PasswordInput";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/auth";
import dayjs from "dayjs";

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

const Profile = () => {
  const [gender, setGender] = useState("Male");
  const [birthDate, setBirthDate] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mname, setMname] = useState("");
  const [momName, setMomName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [study, setStudy] = useState("");
  const [work, setWork] = useState("");
  const [note, setNote] = useState("");
  const [nationalNumber, setNationalNumber] = useState("");
  const [fixPhone, setFixPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [prevVol, setPrevVol] = useState("No");
  const [smoking, setSmoking] = useState("No");
  const [fileId, setFileId] = useState<number | null>(null);
  const [compSkill, setCompSkill] = useState("No");
  const [koboSkill, setKoboSkill] = useState("No");
  const [errors, setErrors] = useState<any>({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state?.allUserData?.userId);
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`/user/${userId}`);
        console.log(response);
        setFname(response.data?.ServiceProvider?.Volunteer?.Person?.fname);
        setLname(response.data?.ServiceProvider?.Volunteer?.Person?.lname);
        setMname(response.data?.ServiceProvider?.Volunteer?.Person?.mname);
        setMomName(response.data?.ServiceProvider?.Volunteer?.Person?.momname);
        setEmail(response.data?.ServiceProvider?.Volunteer?.Person?.email);
        setPhone(response.data?.ServiceProvider?.Volunteer?.Person?.phone);
        setNote(response.data?.ServiceProvider?.Volunteer?.Person?.note);
        setWork(response.data?.ServiceProvider?.Volunteer?.Person?.work);
        setStudy(response.data?.ServiceProvider?.Volunteer?.Person?.study);
        setBirthDate(response.data?.ServiceProvider?.Volunteer?.Person?.bDate);
        setAddressId(
          response.data?.ServiceProvider?.Volunteer?.Person?.addressId
        );
        setPrevVol(response.data?.ServiceProvider?.Volunteer?.Person?.prevVol);
        setSmoking(response.data?.ServiceProvider?.Volunteer?.Person?.smoking);
        setCompSkill(
          response.data?.ServiceProvider?.Volunteer?.Person?.compSkill
        );
        setKoboSkill(
          response.data?.ServiceProvider?.Volunteer?.Person?.koboSkill
        );
        setNationalNumber(
          response.data?.ServiceProvider?.Volunteer?.Person?.nationalNumber
        );
        setFixPhone(
          response.data?.ServiceProvider?.Volunteer?.Person?.fixPhone
        );
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, [userId]);

  const validateForm = () => {
    const newErrors: any = {};
    if (!gender) newErrors.gender = t("gender is required");
    if (!birthDate) newErrors.birthDate = t("birth date is required");
    if (!prevVol)
      newErrors.prevVol = t("previous volunteer experience is required");
    if (!compSkill)
      newErrors.compSkill = t("microsoft office Skills is required");
    if (!smoking) newErrors.smoking = t("smoking status is required");
    if (!koboSkill) newErrors.koboSkill = t("Kobo tool experience is required");
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
      userData: {
        password,
      },
    };
    console.log(payload);
    try {
      const response = await axios.put(`/user/${userId}`, payload);
      if (response.status === 201) {
        navigate("/");
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
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        {t("profile")}
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
            value: fname,
            onChange: setFname,
          },
          {
            id: "mname",
            label: t("mname"),
            placeholder: t("Adam"),
            value: mname,
            onChange: setMname,
          },
          {
            id: "lname",
            label: t("lname"),
            placeholder: t("Doe"),
            value: lname,
            onChange: setLname,
          },
          {
            id: "momname",
            label: t("momName"),
            placeholder: t("Jane"),
            value: momName,
            onChange: setMomName,
          },
          {
            id: "phone",
            label: t("phone"),
            placeholder: "0988776655",
            value: phone,
            onChange: setPhone,
          },
          {
            id: "email",
            label: t("email"),
            placeholder: "example@akhs.com",
            value: email,
            onChange: setEmail,
          },
          {
            id: "study",
            label: t("study"),
            placeholder: t("software engineering"),
            value: study,
            onChange: setStudy,
          },
          {
            id: "work",
            label: t("work"),
            placeholder: t("software developer"),
            value: work,
            onChange: setWork,
          },
          {
            id: "nationalNumber",
            label: t("nationalNumber"),
            placeholder: "050500",
            value: nationalNumber,
            onChange: setNationalNumber,
          },
          {
            id: "fixPhone",
            label: t("fixPhone"),
            placeholder: "0338800000",
            value: fixPhone,
            onChange: setFixPhone,
          },
        ].map(({ id, label, placeholder, value, onChange }) => {
          return id !== "password" ? (
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
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                fullWidth
                error={!!errors[id]}
              />
              {errors[id] && <FormHelperText>{errors[id]}</FormHelperText>}
            </FormControl>
          ) : (
            <FormControl
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 30%" },
                minWidth: "20%",
              }}
              key={id}
              error={!!errors[id]}
            >
              <FormLabel htmlFor="password">{t("password")}</FormLabel>
              <PasswordInput
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
              {errors[id] && <FormHelperText>{errors[id]}</FormHelperText>}
            </FormControl>
          );
        })}

        <FormControl
          sx={{ flex: { xs: "1 1 100%", md: "1 1 30%" } }}
          error={!!errors.birthDate}
        >
          <FormLabel htmlFor="birthDate">{t("birth date")}</FormLabel>
          <TextField
            id="birthDate"
            name="birthDate"
            type="date"
            value={dayjs(birthDate).format("YYYY-MM-DD")}
            onChange={(e) => setBirthDate(e.target.value)}
            fullWidth
            error={!!errors.birthDate}
          />
          {errors.birthDate && (
            <FormHelperText>{errors.birthDate}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          component="fieldset"
          sx={{ flex: { xs: "1 1 100%", md: "1 1 40%" } }}
          error={!!errors.addressId}
        >
          <FormLabel>{t("address")}</FormLabel>
          <Address
            setAddressId={setAddressId}
          />
          {errors.addressId && (
            <FormHelperText>{errors.addressId}</FormHelperText>
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            error={!!errors["note"]}
          />
          {errors["note"] && <FormHelperText>{errors["note"]}</FormHelperText>}
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
            <FormControlLabel
              value="Male"
              control={<Radio />}
              label={t("male")}
            />
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
            <FormControlLabel
              value="Yes"
              control={<Radio />}
              label={t("yes")}
            />
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
            <FormControlLabel
              value="Yes"
              control={<Radio />}
              label={t("yes")}
            />
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
            <FormControlLabel
              value="Yes"
              control={<Radio />}
              label={t("yes")}
            />
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
            <FormControlLabel
              value="Yes"
              control={<Radio />}
              label={t("yes")}
            />
            <FormControlLabel value="No" control={<Radio />} label={t("no")} />
          </RadioGroup>
        </FormControl>

        <FormControl
          error={!!errors.fileId}
          component="fieldset"
          sx={{ flex: "1 1 50%" }}
        >
          <FormLabel htmlFor="resume">{t("your resume")}</FormLabel>
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
            {isLoading ? t("creating new user...") : t("create new user")}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default Profile;

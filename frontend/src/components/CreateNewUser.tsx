/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
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
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import Address from "./Address";
import axios from "../utils/axios";
import PasswordInput from "./PasswordInput";
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

const CreateNewUser = () => {
  const [gender, setGender] = useState("Male");
  const [birthDate, setBirthDate] = useState("");
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
  const [department, setDepartment] = React.useState("");
  const [position, setPosition] = React.useState("");
  const navigate = useNavigate();

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
    if (!department) newErrors.departmentId = t("department is required");
    if (!position) newErrors.positionId = t("position is required");
    if (!role) newErrors.roleId = t("role is required");

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
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState<any>([{}]);
  const [departments, setDepartments] = useState<any>([{}]);
  const [positions, setPositions] = useState<any>([{}]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const selectedDepartment = departmentOptions.filter((depOption: any) => {
      if (depOption.label === department) return depOption;
    });
    const sendedDepartmentId = selectedDepartment?.[0]?.id || null;

    const selectedPosition = positionOptions.filter((posOption: any) => {
      if (posOption.label === position) return posOption;
    });
    const selectedRole = roleOptions.filter((roleOption: any) => {
      if (roleOption.label === role) return roleOption;
    });
    const sendedPositionId = selectedPosition?.[0].id || null;
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
      serviceProviderData: {
        departmentId: sendedDepartmentId,
        positionId: sendedPositionId,
      },
      userData: {
        password,
        position,
        roleId: selectedRole[0].id,
      },
    };
    console.log(payload);
    try {
      const response = await axios.post("/user", payload);
      if (response.status === 201) {
        navigate("/user-management");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize departments and positions with default values if empty
  const departmentOptions = useMemo(
    () =>
      departments.length > 0
        ? departments.map((department: any) => ({
            label: department.name,
            id: department.id,
          }))
        : [{ label: t("no departments available"), id: null }],
    [departments, t]
  );

  const positionOptions = useMemo(
    () =>
      positions.length > 0
        ? positions.map((position: any) => ({
            label: position.name,
            id: position.id,
          }))
        : [{ label: t("no positions available"), id: null }],
    [positions, t]
  );
  const roleOptions = useMemo(
    () =>
      roles.length > 0
        ? roles.map((role: any) => ({
            label: role.name,
            id: role.id,
          }))
        : [{ label: t("no positions available"), id: null }],
    [roles, t]
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
    async function fetchRole() {
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
    }
    fetchPosition();

    fetchDepartment();
    fetchRole();
  }, []);

  // console.log("department is", department);
  // console.log("departmentId is", departmentId);
  return (
    <Card variant="highlighted">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        {t("create new user")}
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
        ].map(({ id, label, placeholder }) => {
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
          component="fieldset"
          sx={{ flex: { xs: "1 1 100%", md: "1 1 30%" } }}
          error={!!errors.roleId}
        >
          <FormLabel htmlFor="Role">{t("role")}</FormLabel>
          <Select
            labelId="Role"
            id="Role"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            {roleOptions?.map((roleoption: any) => (
              <MenuItem key={roleoption.id} value={roleoption.label}>
                {roleoption.label}
              </MenuItem>
            ))}
          </Select>
          {errors.roleId && <FormHelperText>{errors.roleId}</FormHelperText>}
        </FormControl>
        <FormControl
          component="fieldset"
          sx={{ flex: { xs: "1 1 100%", md: "1 1 30%" } }}
          error={!!errors.departmentId}
        >
          <FormLabel htmlFor="Department">{t("department")}</FormLabel>
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
          {errors.departmentId && (
            <FormHelperText>{errors.departmentId}</FormHelperText>
          )}
        </FormControl>
        <FormControl
          component="fieldset"
          sx={{ flex: { xs: "1 1 100%", md: "1 1 40%" } }}
          error={!!errors.positionId}
        >
          <FormLabel htmlFor="position">{t("position")}</FormLabel>
          <Select
            labelId="position"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {positionOptions?.map((positionoption: any) => (
              <MenuItem key={positionoption.id} value={positionoption.label}>
                {positionoption.label}
              </MenuItem>
            ))}
          </Select>
          {errors.positionId && (
            <FormHelperText>{errors.positionId}</FormHelperText>
          )}
        </FormControl>
        <FormControl
          component="fieldset"
          sx={{ flex: { xs: "1 1 100%", md: "1 1 40%" } }}
          error={!!errors.addressId}
        >
          <FormLabel>{t("address")}</FormLabel>
          <Address setAddressId={setAddressId} />
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
            {isLoading
              ? t("creating new user...")
              : t("create new user")}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default CreateNewUser;

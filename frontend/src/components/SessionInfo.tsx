/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, Card, FormLabel, Stack, TextField } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "../utils/axios";
import dayjs from "dayjs";
import isDateInFormat from "../utils/isDateInFormat";
import { DirectionContext } from "../shared-theme/AppTheme";
import { useTranslation } from "react-i18next";
import AlertNotification from "./AlertNotification";

const SessionInfo = ({
  selectedDepartment,
  removeSession,
  sessionName,
  setSessionName,
  serviceProviders,
  setServiceProviders,
  hallName,
  setHallName,
  dateValue,
  min,
  max,
  setDateValue,
  providerNames,
  setProviderNames,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: any) => {
  const { direction } = useContext(DirectionContext); // Get the current direction (ltr or rtl)
  const [selectedServiceProvider, setSelectedServiceProvider] = useState([]);
  const { t } = useTranslation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  useEffect(() => {
    axios
      .get("/serviceprovider")
      .then((response) => {
        const serviceproviders = response.data;
        console.log({ serviceproviders });
        const activeServiceProvider = serviceproviders.filter((item: any) => {
          console.log(item);
          return item.Volunteer.active_status === "active";
        });
        setServiceProviders(
          activeServiceProvider.map((provider: any) => ({
            label: `${provider.Volunteer.Person.fname} ${provider.Volunteer.Person.lname} - ${provider.Position?.name}`,
            value: provider.providerId,
            depId: provider.Department?.id,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const selectedProvider = serviceProviders.filter(
      (serv: any) => serv.depId === parseInt(selectedDepartment)
    );
    setSelectedServiceProvider(selectedProvider);
  }, [serviceProviders, selectedDepartment]);

  return (
    <>
      <AlertNotification
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleAlertClose}
      />
      <Card
        sx={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          padding: 2,
        }}
      >
        {/* Clear Button */}
        <ClearIcon
          onClick={removeSession}
          style={{
            position: "absolute",
            top: 8,
            [direction === "rtl" ? "left" : "right"]: 8,
            cursor: "pointer",
          }}
        />

        {/* Session Fields */}
        <Stack>
          <FormLabel>{t("session name")}</FormLabel>
          <TextField
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            sx={{ width: 100 }}
          />
        </Stack>

        <Stack>
          <FormLabel>{t("date")}</FormLabel>
          <TextField
            type="date"
            value={
              isDateInFormat(dateValue, "YYYY-MM-DD")
                ? dateValue
                : dayjs(dateValue).format("YYYY-MM-DD")
            }
            inputProps={{
              min: isDateInFormat(min, "YYYY-MM-DD")
                ? min
                : dayjs(min).format("YYYY-MM-DD"),
              max: isDateInFormat(max, "YYYY-MM-DD")
                ? max
                : dayjs(max).format("YYYY-MM-DD"),
            }}
            onChange={(e) => setDateValue(e.target.value)}
          />
        </Stack>

        <Stack>
          <FormLabel>{t("hall name")}</FormLabel>
          <TextField
            value={hallName}
            onChange={(e) => setHallName(e.target.value)}
            sx={{ width: 100 }}
          />
        </Stack>

        <Stack>
          <FormLabel>{t("service provider")}</FormLabel>
          <Autocomplete
            multiple
            options={selectedServiceProvider || []}
            value={Array.isArray(providerNames) ? providerNames : []}
            onChange={(_event, newValue) => setProviderNames(newValue)}
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField {...params} variant="standard" />
            )}
            sx={{ maxWidth: 250 }}
          />
        </Stack>

        <Stack>
          <FormLabel htmlFor="startTime">{t("start time")}</FormLabel>
          <TextField
            id="startTime"
            type="time"
            value={
              (startTime &&
                `${startTime.split(":")[0]}:${startTime.split(":")[1]}`) ||
              dayjs(startTime).format("HH:mm")
            }
            onChange={(e) => {
              const val = e.target.value;
              if (
                val.split(":")[0] > endTime.split(":")[0] ||
                (val.split(":")[0] === endTime.split(":")[0] &&
                  val.split(":")[1] > endTime.split(":")[1])
              ) {
                setAlertMessage("start time must be before end time");
                setAlertSeverity("error");
                setAlertOpen(true);
                return;
              }
              setStartTime(val);
            }}
          />
        </Stack>

        <Stack>
          <FormLabel htmlFor="endTime">{t("end time")}</FormLabel>
          <TextField
            id="endTime"
            type="time"
            value={
              (endTime &&
                `${endTime.split(":")[0]}:${endTime.split(":")[1]}`) ||
              dayjs(endTime).format("HH:mm")
            }
            onChange={(e) => {
              const val = e.target.value;
              if (
                val.split(":")[0] < startTime.split(":")[0] ||
                (val.split(":")[0] === startTime.split(":")[0] &&
                  val.split(":")[1] < startTime.split(":")[1])
              ) {
                setAlertMessage("end time must be after start time");
                setAlertSeverity("error");
                setAlertOpen(true);
                return;
              }
              setEndTime(val);
            }}
          />
        </Stack>
      </Card>
    </>
  );
};

export default SessionInfo;

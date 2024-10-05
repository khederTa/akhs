import { Autocomplete, Card, FormLabel, Stack, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import ClearIcon from "@mui/icons-material/Clear";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const SessionInfo = ({ id, removeSession }: any) => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [hallName, setHallName] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [providerNames, setProviderNames] = useState([]);
  const [trainerName, setTrainerName] = useState([]);
  const [startTime, setStartTime] = React.useState<Dayjs | null>(
    dayjs("2022-04-17T15:30")
  );
  const [endTime, setEndTime] = React.useState<Dayjs | null>(
    dayjs("2022-04-17T15:30")
  );
  // Fetch data from API
  useEffect(  () => {
     axios
      .get("serviceproviders") // Replace with your API endpoint
      .then((response) => {
        const serviceproviders = response.data;
        setTrainers(
          serviceproviders
            .filter((provider: any) => provider.position === "trainer")
            .map((provider: any) => ({
              label: provider.Person.fname,
              value: provider.providerId,
            }))
        );

        setServiceProviders(
          serviceproviders
            .filter((provider: any) => provider.position === "serviceprovider")
            .map((provider: any) => ({
              label: provider.Person.fname,
              value: provider.providerId,
            }))
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <Card
        sx={{
          display: "flex",
          height: "auto",
          width: 1270,
          justifyContent: "space-between",
        }}
      >
        <Stack>
          <FormLabel>Date</FormLabel>
          <TextField
            sx={{ width: 150 }}
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
        </Stack>

        <Stack>
          <FormLabel>Hall Name</FormLabel>
          <TextField
            sx={{ width: 150 }}
            value={hallName}
            onChange={(event) => setHallName(event.target.value)}
          />
        </Stack>

        <Stack>
          <FormLabel>Trainer Name</FormLabel>
          <Autocomplete
            sx={{ width: 150 }}
            multiple
            options={trainers}
            value={trainerName}
            onChange={(event, newValue: any) => setTrainerName(newValue)}
            getOptionLabel={(option) => option.label || ""}
            defaultValue={[]}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>

        <Stack>
          <FormLabel>Service Provider Name</FormLabel>
          <Autocomplete
            sx={{ width: 150 }}
            multiple
            options={serviceProviders}
            value={providerNames}
            onChange={(event, newValue: any) => setProviderNames(newValue)}
            getOptionLabel={(option) => option.label || ""}
            defaultValue={[]}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>

        <Stack >
          <FormLabel>Start Time</FormLabel>
          <LocalizationProvider  dateAdapter={AdapterDayjs}>
            <DemoContainer components={[ "TimePicker"]}>
              <TimePicker

                sx={{ width: 100  }}
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>

        <Stack >
          <FormLabel>End Time</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={[ "TimePicker"]}>
              <TimePicker
                sx={{ width: 100 }}
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>

        <Stack>
          {/* Use the removeSession function passed from the parent */}
          <ClearIcon onClick={removeSession} style={{ cursor: "pointer" }} />
        </Stack>
      </Card>
    </>
  );
};

export default SessionInfo;

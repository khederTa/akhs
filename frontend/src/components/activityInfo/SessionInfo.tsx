import { Autocomplete, Card, FormLabel, Stack, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import ClearIcon from "@mui/icons-material/Clear";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const SessionInfo = ({
  id,
  removeSession,
  sessionName,
  setSessionName,
  serviceProviders,
  setServiceProviders,
  trainers,
  setTrainers,
  hallName,
  setHallName,
  dateValue,
  setDateValue,
  providerNames,
  setProviderNames,
  trainerName,
  setTrainerName,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: any) => {
  // Fetch data from API
  useEffect(() => {
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

  // Handle form submission

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
          <FormLabel>Session Name</FormLabel>
          <TextField
            sx={{ width: 100 }}
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        </Stack>

        <Stack>
          <FormLabel>Date</FormLabel>
          <TextField
            sx={{ width: 100 }}
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
        </Stack>

        <Stack>
          <FormLabel>Hall Name</FormLabel>
          <TextField
            sx={{ width: 100 }}
            value={hallName}
            onChange={(event) => setHallName(event.target.value)}
          />
        </Stack>

        <Stack>
          <FormLabel>Trainer</FormLabel>
          <Autocomplete
            id="tags-filled"
            sx={{ width: 170 }}
            multiple
            options={trainers}
            value={trainerName}
            onChange={(event, newValue: any) => setTrainerName(newValue)}
            getOptionLabel={(option) => option.label || ""}
            defaultValue={[]}
            renderInput={(params) => (
              <TextField {...params} variant="standard" />
            )}
          />
        </Stack>

        <Stack>
          <FormLabel>Service Provider</FormLabel>
          <Autocomplete
            id="tags-filled"
            sx={{ width: 170 }}
            multiple
            options={serviceProviders}
            value={providerNames}
            onChange={(event, newValue: any) => setProviderNames(newValue)}
            getOptionLabel={(option) => option.label || ""}
            defaultValue={[]}
            renderInput={(params) => (
              <TextField {...params} variant="standard" />
            )}
          />
        </Stack>

        <Stack>
          <FormLabel>Start Time</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
              <TimePicker
                sx={{ width: 100 }}
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>

        <Stack>
          <FormLabel>End Time</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
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

import { Autocomplete, Card, FormLabel, Stack, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "../../utils/axios";
import dayjs from "dayjs";

const SessionInfo = ({
  id,
  selectedDepartment,
  removeSession,
  sessionName,
  setSessionName,
  serviceProviders,
  setServiceProviders,
  hallName,
  setHallName,
  dateValue,
  setDateValue,
  providerNames,
  setProviderNames,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: any) => {
  const [selectedServiceProvider, setSelectedServiceProvider] = useState([]);
  console.table({dateValue})
  // Fetch data from API
  useEffect(() => {
    axios
      .get("serviceprovider") // Replace with your API endpoint
      .then((response) => {
        const serviceproviders = response.data;
        setServiceProviders(
          serviceproviders.map((provider: any) => ({
            label: `${provider.Volunteer.Person.fname} ${provider.Volunteer.Person.lname} - ${provider.Position.name}`,
            value: provider.providerId,
            depId: provider.Department.id,
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
    <Card
      sx={{
        display: "flex",
        height: "auto",
        width: 1200,
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
          type="date"
          value={
            dayjs(dateValue).isValid()
              ? dayjs(dateValue).format("YYYY-MM-DD")
              : ""
          }
          onChange={(e) => setDateValue(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Stack>
        <FormLabel>Hall Name</FormLabel>
        <TextField
          sx={{ width: 100 }}
          value={hallName}
          onChange={(e) => setHallName(e.target.value)}
        />
      </Stack>

      <Stack>
        <FormLabel>Service Provider</FormLabel>
        <Autocomplete
          id="tags-filled"
          sx={{ width: 160 }}
          multiple
          options={selectedServiceProvider || []}
          value={Array.isArray(providerNames) ? providerNames : []}
          onChange={(event, newValue) => setProviderNames(newValue)}
          getOptionLabel={(option) => option?.label || ""}
          renderInput={(params) => <TextField {...params} variant="standard" />}
        />
      </Stack>

      <Stack>
        <FormLabel htmlFor="startTime">Start Time</FormLabel>
        <TextField
          id="startTime"
          type="time"
          sx={{ width: 125 }}
          value={dayjs(startTime).format("hh:mm:ss") || ""}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Stack>
        <FormLabel htmlFor="endTime">End Time</FormLabel>
        <TextField
          id="endTime"
          type="time"
          sx={{ width: 125 }}
          value={dayjs(endTime).format("hh:mm:ss")  || ""}
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Stack>
        <ClearIcon onClick={removeSession} style={{ cursor: "pointer" }} />
      </Stack>
    </Card>
  );
};

export default SessionInfo;

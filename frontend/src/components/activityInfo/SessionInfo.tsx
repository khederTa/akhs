import { Autocomplete, Card, FormLabel, Stack, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//import dayjs, { Dayjs } from "dayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
const SessionInfo = () => {
  const [serviceProviders, setServiceProviders] = useState([]); // State to hold fetched data
  const [trainers, setTrainers] = useState([]); // State to hold fetched data
  const [hallName, setHallName] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [providerNames, setProviderNames] = useState([]);
  const [trainerName, setTrainerName] = useState([]);

  // Fetch data from API
  useEffect(() => {
    axios
      .get("serviceproviders") // Replace with your API endpoint
      .then((response) => {
        console.log(response);
        const serviceproviders = response.data;
        setTrainers(() =>
          serviceproviders.map((provider: any) => {
            if(provider === "trainer"){
              return {lable: provider.name}
            }
          })
        );
        setServiceProviders(serviceproviders);
        // setTop100Films(response.data.position); // Assuming response.data is the array of films
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array to run only once on mount
  console.log("trainers", top100Films);
  return (
    <>
      <Card
        sx={{
          display: "flex",
          height: "auto",
          justifyContent: "space-between",
        }}
      >
        <Stack>
          <FormLabel>date</FormLabel>
          <TextField
            sx={{ width: 300 }}
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
        </Stack>

        <Stack>
          <FormLabel>Hall Name</FormLabel>
          <TextField
            sx={{ width: 300 }}
            value={hallName}
            onChange={(event) => setHallName(event.target.value)}
          />
        </Stack>

        <Stack>
          <FormLabel>Trainer Name</FormLabel>
          <Autocomplete
            sx={{ width: 300 }}
            multiple
            id="tags-standard"
            options={}
            value={trainerName}
            onChange={(event, newValue) => setTrainerName(newValue)}
            getOptionLabel={(option) => option.title || ""}
            defaultValue={[]}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>

        <Stack>
          <FormLabel>Service Provider Name</FormLabel>
          <Autocomplete
            sx={{ width: 300 }}
            multiple
            id="tags-standard"
            options={top100Films}
            value={providerNames}
            onChange={(event, newValue) => setProviderNames(newValue)}
            getOptionLabel={(option) => option.title || ""}
            defaultValue={[]}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </Card>
    </>
  );
};

export default SessionInfo;

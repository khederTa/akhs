import { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress, Box } from "@mui/material";
import axios from "../utils/axios";
import { useTranslation } from "react-i18next";

interface AddressType {
  id: number;
  state: string;
  city: string;
  district: string;
  village: string;
}

const Address = ({
  setAddressId,
}: {
  setAddressId: (id: number | null) => void;
}) => {
  const [states, setStates] = useState<AddressType[]>([]);
  const [cities, setCities] = useState<AddressType[]>([]);
  const [districts, setDistricts] = useState<AddressType[]>([]);
  const [villages, setVillages] = useState<AddressType[]>([]);

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/address/states");
        setStates(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/address/cities?state=${selectedState}`
          );
          setCities(response.data);
        } catch (error) {
          console.error("Error fetching cities:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCities();
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      const fetchDistricts = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/address/districts?city=${selectedCity}`
          );
          setDistricts(response.data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDistricts();
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchVillages = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/address/villages?district=${selectedDistrict}`
          );
          setVillages(response.data);
        } catch (error) {
          console.error("Error fetching villages:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVillages();
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedVillage) {
      // When a village is selected, call the passed function with the chosen address ID
      const chosenAddress = villages.find(
        (v: AddressType) => v.village === selectedVillage
      );
      console.log(chosenAddress);
      setAddressId(chosenAddress?.id || null);
    }
  }, [selectedVillage, villages, setAddressId]);

  return (
    <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <Autocomplete
        options={states || []} // Default to an empty array if states is null or undefined
        getOptionLabel={(option) => option.state}
        onChange={(_event, newValue) => {
          setSelectedState(newValue?.state || null);
          setCities([]);
          setDistricts([]);
          setVillages([]);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("state")}
            variant="outlined"
            sx={{
              minWidth: "150px",
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Autocomplete
        options={cities || []} // Default to an empty array if cities is null or undefined
        getOptionLabel={(option) => option.city}
        onChange={(_event, newValue) => {
          setSelectedCity(newValue?.city || null);
          setDistricts([]);
          setVillages([]);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("city")}
            variant="outlined"
            sx={{
              minWidth: "150px",
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        disabled={!selectedState}
      />
      <Autocomplete
        options={districts || []} // Default to an empty array if districts is null or undefined
        getOptionLabel={(option) => option.district}
        onChange={(_event, newValue) => {
          setSelectedDistrict(newValue?.district || null);
          setVillages([]);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("district")}
            variant="outlined"
            sx={{
              minWidth: "150px",
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        disabled={!selectedCity}
      />
      <Autocomplete
        options={villages || []} // Default to an empty array if villages is null or undefined
        getOptionLabel={(option) => option.village}
        onChange={(_event, newValue) =>
          setSelectedVillage(newValue?.village || null)
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("village")}
            variant="outlined"
            sx={{
              minWidth: "150px",
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        disabled={!selectedDistrict}
      />
    </Box>
  );
};

export default Address;

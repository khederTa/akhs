/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormLabel,
  Stack,
} from "@mui/material";
import GridArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { memo, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { DirectionContext } from "../shared-theme/AppTheme";

type Operator = "equals" | "before" | "after" | "between";

interface DateFilterHeaderProps {
  field: string;
  filterModel:
    | {
        [key: string]: { value: string; operator: Operator; endDate?: string };
      }
    | any;
  sortModel: { field: string; direction: "asc" | "desc" };
  filterVisibility: { [key: string]: boolean };
  handleSortClick: (field: string) => void;
  handleFilterChange: (
    field: string,
    value: string,
    operator: Operator,
    endDate?: string
  ) => void;
  setFilterVisibility: (
    update: (prev: { [key: string]: boolean }) => { [key: string]: boolean }
  ) => void;
  clearFilter: (field: string) => void;
}

function DateFilterHeader({
  field,
  filterModel,
  sortModel,
  filterVisibility,
  handleSortClick,
  handleFilterChange,
  setFilterVisibility,
  clearFilter,
}: DateFilterHeaderProps) {
  const { t } = useTranslation();
  const [operator, setOperator] = useState<Operator>("equals");
  const [startDate, setStartDate] = useState<string>(
    filterModel[field]?.value || ""
  );
  const [endDate, setEndDate] = useState<string>(
    filterModel[field]?.endDate || ""
  );
  const { direction } = useContext(DirectionContext);

  const handleOperatorChange = (event: any) => {
    const newOperator = event.target.value as Operator;
    setOperator(newOperator);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleApplyFilter = () => {
    handleFilterChange(field, startDate, operator, endDate);
    setFilterVisibility((prev) => ({ ...prev, [field]: false }));
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    clearFilter(field);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <span>{t(field)}</span>
      <IconButton size="small" onClick={() => handleSortClick(field)}>
        {sortModel.field === field && sortModel.direction === "asc" ? (
          <GridArrowUpwardIcon fontSize="small" />
        ) : (
          <ArrowDownwardIcon fontSize="small" />
        )}
      </IconButton>
      <IconButton
        size="small"
        onClick={() =>
          setFilterVisibility((prev) => ({ ...prev, [field]: !prev[field] }))
        }
      >
        {filterModel[field].value ? <FilterListOffIcon /> : <FilterListIcon />}
      </IconButton>

      <Dialog
        open={filterVisibility[field]}
        onClose={() =>
          setFilterVisibility((prev) => ({ ...prev, [field]: false }))
        }
        sx={{
          alignItems: direction === "rtl" ? "right" : "left",
        }}
        aria-labelledby="filter-dialog-title"
      >
        <DialogTitle id="filter-dialog-title">{t(field)}</DialogTitle>
        <DialogContent>
          <FormControl
            size="small"
            sx={{ marginBottom: "20px !important" }}
            fullWidth
          >
            <Select value={operator} onChange={handleOperatorChange} fullWidth>
              <MenuItem value="equals">{t("equals")}</MenuItem>
              <MenuItem value="before">{t("before")}</MenuItem>
              <MenuItem value="after">{t("after")}</MenuItem>
              <MenuItem value="between">{t("between")}</MenuItem>
            </Select>
          </FormControl>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2} // Adjust the spacing as needed
          >
            <div>
              <FormLabel htmlFor="date1">{t("start date")}</FormLabel>
              <TextField
                id="date1"
                type="date"
                value={startDate}
                onChange={handleDateChange}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: startDate && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setStartDate("")}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div>
              <FormLabel htmlFor="date2">{t("end date")}</FormLabel>
              <TextField
                id="date2"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                fullWidth
                margin="dense"
                disabled={operator !== "between"}
              />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilter} color="secondary">
            {t("reset")}
          </Button>
          <Button
            onClick={handleApplyFilter}
            variant="outlined"
            color="primary"
          >
            {t("apply")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default memo(DateFilterHeader);

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import GridArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { memo, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { DirectionContext } from "../shared-theme/AppTheme";
type FilterHeaderProps = {
  field: string;
  filterModel: { [key: string]: string | number | undefined } | any;
  sortModel: { field: string; direction: "asc" | "desc" };
  filterVisibility: { [key: string]: boolean };
  handleSortClick: (field: string) => void;
  handleFilterChange: (field: string, value: string) => void;
  setFilterVisibility: (
    params: (prev: { [key: string]: boolean }) => { [key: string]: boolean }
  ) => void;
  clearFilter: (field: string) => void;
};

function FilterHeader({
  field,
  filterModel,
  sortModel,
  filterVisibility,
  handleSortClick,
  handleFilterChange,
  setFilterVisibility,
  clearFilter,
}: FilterHeaderProps) {
  const { t } = useTranslation();
  const [tempFilter, setTempFilter] = useState(filterModel[field] || "");
  const { direction } = useContext(DirectionContext);
  const handleApplyFilter = () => {
    handleFilterChange(field, tempFilter as string);
    setFilterVisibility((prev) => ({ ...prev, [field]: false }));
  };

  const handleResetFilter = () => {
    setTempFilter("");
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
        {filterModel[field] ? <FilterListOffIcon /> : <FilterListIcon />}
      </IconButton>

      <Dialog
        open={filterVisibility[field]}
        onClose={() =>
          setFilterVisibility((prev) => ({ ...prev, [field]: false }))
        }
        sx={{
          alignItems: direction === "rtl" ? "right" : "left"
        }}
        aria-labelledby="filter-dialog-title"
      >
        <DialogTitle
          id="filter-dialog-title"
        >
          {t(field)}
        </DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            size="small"
            sx={{ width: "200px" }}
            placeholder={t(`filter by ${field}`)}
            value={tempFilter}
            onChange={(e) => setTempFilter(e.target.value)}
            InputProps={{
              endAdornment: tempFilter && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleResetFilter}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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

export default memo(FilterHeader);

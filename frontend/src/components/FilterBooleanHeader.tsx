/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
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
  import { memo, useState, useEffect, useContext } from "react";
  import { useTranslation } from "react-i18next";
  import FilterListOffIcon from "@mui/icons-material/FilterListOff";
  import { DirectionContext } from "../shared-theme/AppTheme";
  
  type FilterBooleanHeaderProps = {
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
  
  function FilterBooleanHeader({
    field,
    filterModel,
    sortModel,
    filterVisibility,
    handleSortClick,
    handleFilterChange,
    setFilterVisibility,
    clearFilter,
  }: FilterBooleanHeaderProps) {
    const { t } = useTranslation();
    const [selectedValue, setSelectedValue] = useState<string>("");
  
    // Synchronize local selectedValue with filterModel when dialog opens
    useEffect(() => {
      if (filterVisibility[field]) {
        setSelectedValue((filterModel[field] as string) || "");
      }
    }, [filterVisibility, field, filterModel]);
    const { direction } = useContext(DirectionContext);
  
    const handleApplyFilter = () => {
      handleFilterChange(field, selectedValue);
      setFilterVisibility((prev) => ({ ...prev, [field]: false }));
    };
  
    const handleResetFilter = () => {
      setSelectedValue("");
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
            alignItems: direction === "rtl" ? "right" : "left",
          }}
          aria-labelledby="filter-dialog-title"
        >
          <DialogTitle id="filter-dialog-title">{t(field)}</DialogTitle>
          <DialogContent
            sx={{
              minWidth: 200, // Set a minimum width for consistent sizing
            }}
          >
            <Select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              displayEmpty
              fullWidth
              size="small"
              variant="outlined"
              endAdornment={
                selectedValue && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSelectedValue("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }
            >
              <MenuItem value="">{t("all")}</MenuItem>
              <MenuItem value="done">{t("done")}</MenuItem>
              <MenuItem value="not done">{t("not done")}</MenuItem>
            </Select>
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
  
  export default memo(FilterBooleanHeader);
  
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

interface FilterModel {
  [key: string]: string | { value: string; operator: string; endDate?: string };
}

interface FilterVisibility {
  [key: string]: boolean;
}

interface UseGridFilterSortParams {
  initialFilterModel: FilterModel;
  initialFilterVisibility: FilterVisibility;
  rows: any[];
}

interface UseGridFilterSortResult {
  filteredRows: any[];
  filterModel: FilterModel;
  filterVisibility: FilterVisibility;
  sortModel: { field: string; direction: "asc" | "desc" };
  setFilteredRows: React.Dispatch<React.SetStateAction<any[]>>;
  setFilterModel: React.Dispatch<React.SetStateAction<FilterModel>>;
  setFilterVisibility: React.Dispatch<React.SetStateAction<FilterVisibility>>;
  handleTextFilterChange: (field: string, value: string) => void;
  handleDateFilterChange: (
    field: string,
    value: string,
    operator: "equals" | "before" | "after" | "between",
    endDate?: string
  ) => void;
  clearFilter: (field: string) => void;
  clearAllFilters: () => void;
  handleSortClick: (field: string) => void;
}

export function useGridFilterSort({
  initialFilterModel,
  initialFilterVisibility,
  rows,
}: UseGridFilterSortParams): UseGridFilterSortResult {
  const [filteredRows, setFilteredRows] = useState<any[]>(rows);
  const [filterModel, setFilterModel] =
    useState<FilterModel>(initialFilterModel);
  const [filterVisibility, setFilterVisibility] = useState<FilterVisibility>(
    initialFilterVisibility
  );
  const [sortModel, setSortModel] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "",
    direction: "asc",
  });

  const updateFilteredRows = useCallback(() => {
    const filtered = rows.filter((row) => {
      return Object.entries(filterModel).every(([field, value]) => {
        if (typeof value === "string") {
          if (value) {
            const cellValue = row[field]?.toString().toLowerCase() || "";
            const filterValue = value.toLowerCase();
            return field === "gender"
              ? cellValue === filterValue
              : cellValue.includes(filterValue);
          }
          return true;
        } else if (value && typeof value === "object") {
          const { value: filterValue, operator, endDate } = value;
          if (!filterValue) return true;

          const rowDate = new Date(row[field]);
          const filterDate = new Date(filterValue);
          const endDateValue = endDate ? new Date(endDate) : undefined;

          switch (operator) {
            case "equals":
              return rowDate.toDateString() === filterDate.toDateString();
            case "before":
              return rowDate < filterDate;
            case "after":
              return rowDate > filterDate;
            case "between":
              return endDateValue
                ? rowDate >= filterDate && rowDate <= endDateValue
                : false;
            default:
              return true;
          }
        }
        return true;
      });
    });
    setFilteredRows(filtered);
  }, [filterModel, rows]);

  useEffect(() => {
    updateFilteredRows();
  }, [filterModel, updateFilteredRows]);

  const handleTextFilterChange = useCallback((field: string, value: string) => {
    setFilterModel((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleDateFilterChange = useCallback(
    (
      field: string,
      value: string,
      operator: "equals" | "before" | "after" | "between",
      endDate?: string
    ) => {
      setFilterModel((prev) => ({
        ...prev,
        [field]: { value, operator, endDate },
      }));
    },
    []
  );

  const clearFilter = useCallback((field: string) => {
    setFilterModel((prev) => ({
      ...prev,
      [field]:
        field === "bDate" ? { value: "", operator: "equals", endDate: "" } : "",
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterModel(initialFilterModel);
  }, [initialFilterModel]);

  const handleSortClick = useCallback(
    (field: string) => {
      const isAsc = sortModel.field === field && sortModel.direction === "asc";
      const direction = isAsc ? "desc" : "asc";
      setSortModel({ field, direction });

      const sortedRows = [...filteredRows].sort((a, b) => {
        if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
        if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setFilteredRows(sortedRows);
    },
    [sortModel, filteredRows]
  );

  return {
    filteredRows,
    filterModel,
    filterVisibility,
    sortModel,
    setFilteredRows,
    setFilterModel,
    setFilterVisibility,
    handleTextFilterChange,
    handleDateFilterChange,
    clearFilter,
    clearAllFilters,
    handleSortClick,
  };
}

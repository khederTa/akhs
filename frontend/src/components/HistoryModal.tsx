/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  forwardRef,
  ReactElement,
  Ref,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  Dialog,
  Slide,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import axios from "../utils/axios";
import { Loading } from "./Loading";
import { TransitionProps } from "@mui/material/transitions";
import { useTranslation } from "react-i18next";
import GridCustomToolbar from "./GridCustomToolbar";
import { useGridFilterSort } from "../hooks/useGridFilterSort";
import FilterHeader from "./FilterHeader";
import DateFilterHeader from "./DateFilterHeader";
import CustomDateRenderer from "./CustomDateRenderer";
const paginationModel = { page: 0, pageSize: 5 };

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<unknown> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface HistoryModalProps {
  volunteerId: number;
  open: boolean;
  onClose: () => void;
}

export default function HistoryModal({
  volunteerId,
  open,
  onClose,
}: HistoryModalProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const apiRef = useGridApiRef();
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const {
    filteredRows,
    sortModel,
    filterModel,
    filterVisibility,
    setFilterVisibility,
    handleTextFilterChange,
    handleDateFilterChange,
    clearFilter,
    clearAllFilters,
    handleSortClick,
  } = useGridFilterSort({
    initialFilterModel: {
      name: "",
      description: "",
      title: "",
      startDate: { value: "", operator: "equals", endDate: "" },
    },
    initialFilterVisibility: {
      name: false,
      description: false,
      title: false,
      startDate: false,
    },
    rows, // your initial rows data
  });
  const fetchData = useCallback(
    async (endpoint: string) => {
      setIsLoading(true);
      try {
        const response = await axios.get(endpoint);
        if (response.status === 200) {
          console.log(response);
          if (activeTab === 0) {
            const activitySet = new Set();
            const handledData = response.data.packages.map(
              (packageRow: { ActivityTypes: any[] }) => {
                let numberOfAttendedActivity = 0;

                packageRow.ActivityTypes.forEach((actRow: { id: number }) => {
                  response.data.activityData.forEach(
                    (activity: { activityTypeId: number }) => {
                      if (!activitySet.has(activity.activityTypeId)) {
                        if (actRow.id === activity.activityTypeId) {
                          numberOfAttendedActivity++;
                        }
                        activitySet.add(activity.activityTypeId);
                      }
                    }
                  );
                });

                return {
                  ...packageRow,
                  activityTypes: packageRow.ActivityTypes,
                  progress: t("activityOfTotal", {
                    count: numberOfAttendedActivity,
                    total: packageRow.ActivityTypes.length,
                  }),
                };
              }
            );

            setRows(handledData);
          } else {
            const adjustedData = response.data.map((activityRow: any) => ({
              ...activityRow,
              activityType: activityRow.ActivityType,
            }));
            setRows(adjustedData);
          }
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeTab, t]
  );

  useEffect(() => {
    if (volunteerId && open) {
      const endpoint =
        activeTab === 0
          ? `/package/volunteer-packages/${volunteerId}`
          : `/activity/volunteer-activity/${volunteerId}`;
      fetchData(endpoint);
    }
  }, [volunteerId, activeTab, open, fetchData]);

  const ActivityTypeRenderer = (params: any) => {
    const selectedActivityTypes = params.value || [];
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          height: "100%",
          alignItems: "center",
        }}
      >
        {selectedActivityTypes?.map((activityType: any) => (
          <Chip key={activityType.id} label={activityType.name} size="small" />
        ))}
      </Box>
    );
  };

  const columns: any = useMemo(() => {
    if (activeTab === 0) {
      return [
        {
          field: "id",
          headerName: t("id"),
          minWidth: 100,
          sortable: true,
          editable: false,
        },
        {
          field: "name",
          headerName: t("name"),
          minWidth: 200,
          sortable: false,
          hideSortIcons: true,
          editable: false,
          renderHeader: () => (
            <FilterHeader
              key={"name"}
              field={"name"}
              filterModel={filterModel}
              sortModel={sortModel}
              filterVisibility={filterVisibility}
              handleSortClick={handleSortClick}
              handleFilterChange={handleTextFilterChange}
              setFilterVisibility={setFilterVisibility}
              clearFilter={clearFilter}
            />
          ),
        },
        {
          field: "description",
          headerName: t("description"),
          minWidth: 200,
          sortable: false,
          hideSortIcons: true,
          editable: false,
          renderHeader: () => (
            <FilterHeader
              key={"description"}
              field={"description"}
              filterModel={filterModel}
              sortModel={sortModel}
              filterVisibility={filterVisibility}
              handleSortClick={handleSortClick}
              handleFilterChange={handleTextFilterChange}
              setFilterVisibility={setFilterVisibility}
              clearFilter={clearFilter}
            />
          ),
        },
        {
          field: "activityTypes",
          headerName: t("activity types"),
          minWidth: 200,
          editable: false,
          sortable: false,
          hideSortIcons: false,
          renderCell: (params: any) => <ActivityTypeRenderer {...params} />,
        },
        {
          field: "progress",
          headerName: t("progress"),
          minWidth: 200,
          editable: false,
          sortable: false,
          hideSortIcons: false,
        },
      ];
    } else {
      return [
        {
          field: "id",
          headerName: t("id"),
          minWidth: 100,
          sortable: true,
          editable: false,
        },
        {
          field: "title",
          headertitle: t("title"),
          minWidth: 200,
          sortable: false,
          hideSortIcons: true,
          editable: false,
          renderHeader: () => (
            <FilterHeader
              key={"title"}
              field={"title"}
              filterModel={filterModel}
              sortModel={sortModel}
              filterVisibility={filterVisibility}
              handleSortClick={handleSortClick}
              handleFilterChange={handleTextFilterChange}
              setFilterVisibility={setFilterVisibility}
              clearFilter={clearFilter}
            />
          ),
        },
        {
          field: "startDate",
          headertitle: t("startDate"),
          minWidth: 200,
          sortable: false,
          hideSortIcons: true,
          editable: false,
          renderCell: (params: { value: string | Date }) => (
            <CustomDateRenderer value={params.value} />
          ),
          renderHeader: () => (
            <DateFilterHeader
              key={"startDate"}
              field={"startDate"}
              filterModel={filterModel}
              sortModel={sortModel}
              filterVisibility={filterVisibility}
              handleSortClick={handleSortClick}
              handleFilterChange={handleDateFilterChange}
              setFilterVisibility={setFilterVisibility}
              clearFilter={clearFilter}
            />
          ),
        },
        {
          field: "numSessions",
          headerName: t("numSessions"),
          minWidth: 200,
          sortable: false,
          hideSortIcons: true,
          editable: false,
        },
        {
          field: "minSessions",
          headerName: t("minSessions"),
          minWidth: 200,
          sortable: false,
          hideSortIcons: true,
          editable: false,
        },
        {
          field: "activityType",
          headerName: t("activity type"),
          minWidth: 200,
          editable: true,
          sortable: false,
          hideSortIcons: false,
          renderCell: (params: any) => {
            return (
              <Chip
                key={params?.value?.id}
                label={params?.value?.name}
                size="small"
              />
            );
          },
        },
      ];
    }
  }, [
    activeTab,
    clearFilter,
    filterModel,
    filterVisibility,
    handleDateFilterChange,
    handleSortClick,
    handleTextFilterChange,
    setFilterVisibility,
    sortModel,
    t,
  ]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<any>({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsToExport, setSelectedRowsToExport] = useState<any>([]);
  const [selectedRowsIds, setSelectedRowsIds] = useState<any[]>([]);
  const handleSelectionChange = (newSelection: any[]) => {
    const newSelectedRows: any = newSelection.map((selected) => {
      return rows.find((row: any) => row.id === selected);
    });
    setSelectedRowsIds(newSelection);
    setSelectedRows(newSelectedRows);
  };

  useEffect(() => {
    // Filter rows to include only the visible columns
    const processedRows = selectedRows.map((row) => {
      const newRow: any = {};
      for (const col in row) {
        if (columnVisibilityModel[col] !== false) {
          // Include only if the column is visible
          newRow[col] = row[col];
        }
      }
      return newRow;
    });

    // Create a new array with translated keys
    const translatedRows = processedRows.map((row: any) => {
      if (!row) return;
      const translatedRow: any = {};
      Object.keys(row).forEach((key) => {
        if (
          !key.toLowerCase().includes("id") &&
          !(key.toLowerCase() === "file") &&
          !(key.toLowerCase() === "active_status")
        )
          translatedRow[t(key)] = row[key];
      });

      return translatedRow;
    });

    setSelectedRowsToExport(translatedRows);
  }, [selectedRows, columnVisibilityModel, t]);

  // useEffect(() => console.log(selectedRows), [selectedRows]);
  // useEffect(() => console.log(selectedRowsToExport), [selectedRowsToExport]);
  // useEffect(() => console.log(columnVisibilityModel), [columnVisibilityModel]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "var(--template-palette-background-paper)",
          color: "var(--template-palette-text-secondary)",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {t("Volunteer Details")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={t("Attended Packages")} sx={{ padding: "10px 12px" }} />
          <Tab label={t("Attended Activities")} sx={{ padding: "10px 12px" }} />
        </Tabs>
      </Box>
      {isLoading ? (
        <Loading />
      ) : (
        <Paper sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            // processRowUpdate={handleProcessRowUpdate}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            getRowId={(row) => row.id} // Ensure the correct row ID is used
            disableColumnFilter
            disableColumnMenu
            slots={{
              toolbar: () => (
                <GridCustomToolbar
                  clearAllFilters={clearAllFilters}
                  rows={selectedRowsToExport}
                  navigateTo={"/volunteer-information"}
                  mode="history"
                />
              ),
            }}
            editMode="row"
            localeText={{
              toolbarColumns: t("columns"),
              toolbarDensity: t("density"),
            }}
            apiRef={apiRef}
            onRowSelectionModelChange={(newSelection: any) =>
              handleSelectionChange(newSelection)
            }
            rowSelectionModel={selectedRowsIds}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(model) =>
              setColumnVisibilityModel(model)
            }
            checkboxSelection // Enable checkboxes for row selection
            keepNonExistentRowsSelected
            disableRowSelectionOnClick
          />
        </Paper>
      )}
    </Dialog>
  );
}

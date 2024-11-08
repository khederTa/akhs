/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@mui/material";
import {
  GridToolbarContainerProps,
  useGridRootProps,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { forwardRef, useState } from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReportModal } from "./ReportModal";

type ToolbarProps = {
  rows: any;
  navigateTo: string;
  clearAllFilters: () => void;
};
const GridCustomToolbar = forwardRef<
  HTMLDivElement,
  GridToolbarContainerProps & ToolbarProps
>(function GridToolbar(props, ref) {
  const { className, clearAllFilters, rows, navigateTo, ...other } = props;
  const rootProps = useGridRootProps();
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <>
      <ReportModal
        open={reportModalIsOpen}
        handleClose={() => setReportModalIsOpen(false)}
        setReportName={setReportName}
        reportName={reportName}
        rows={rows}
      />
      <GridToolbarContainer>
        <>
          <Button type="button" onClick={() => navigate(navigateTo)}>
            <AddOutlinedIcon />
            {t("add")}
          </Button>
        </>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <>
          <Button onClick={() => setReportModalIsOpen(true)}>
            <FileDownloadOutlinedIcon />
            {t("export")}
          </Button>
        </>

        <>
          <Button onClick={() => clearAllFilters()}>
            <FilterListOffIcon />
            {t("clearFilters")}
          </Button>
        </>
      </GridToolbarContainer>
    </>
  );
});
export default GridCustomToolbar;

/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, FormControlLabel, FormGroup } from "@mui/material";
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
import Checkbox from "@mui/material/Checkbox";

import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReportModal } from "./ReportModal";
import ActivityDraggableModal from "./ActivityDraggableModal";
import VolunteerModal from "./VolunteerModal";

type ToolbarProps = {
  rows: any;
  navigateTo: string;
  clearAllFilters: () => void;
  mode?: string;
  setGetEligible?: (value: boolean) => void;
  getEligible?: boolean;
  onSave?: (value: any) => void;
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
  const [open, setOpen] = useState(false);
  const [openVolunteerModal, setOpenVolunteerModal] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
    event.target.checked;
    if (props.setGetEligible) props.setGetEligible(event.target.checked);
  };
  return (
    <>
      <VolunteerModal
        open={openVolunteerModal}
        onClose={() => setOpenVolunteerModal(false)}
        onSave={props.onSave}
      />
      <ReportModal
        open={reportModalIsOpen}
        handleClose={() => setReportModalIsOpen(false)}
        setReportName={setReportName}
        reportName={reportName}
        rows={rows}
      />
      <ActivityDraggableModal open={open} onClose={() => setOpen(false)} />

      <GridToolbarContainer>
        {props.mode === "show" && (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.getEligible}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={t("get eligible volunteer")}
            />
          </FormGroup>
        )}
        {props.mode !== "show" &&
          props.mode !== "addActivity" &&
          props.mode !== "inviteMore" &&
          props.mode !== "exe" &&
          props.mode !== "history" && (
            <>
              <Button type="button" onClick={() => navigate(navigateTo)}>
                <AddOutlinedIcon />
                {t("add")}
              </Button>
            </>
          )}
        {props.mode === "addActivity" && (
          <>
            <Button type="button" onClick={() => setOpen(true)}>
              <AddOutlinedIcon />
              {t("add")}
            </Button>
          </>
        )}
        {props.mode === "inviteMore" && (
          <>
            <Button type="button" onClick={() => setOpenVolunteerModal(true)}>
              <AddOutlinedIcon />
              {t("invite more volunteers")}
            </Button>
          </>
        )}
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        {props.mode !== "show" && (
          <>
            <Button
              onClick={() => setReportModalIsOpen(true)}
              disabled={rows.length === 0}
            >
              <FileDownloadOutlinedIcon />
              {t("export")}
            </Button>
          </>
        )}

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

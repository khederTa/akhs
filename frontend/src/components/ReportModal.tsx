import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import { exportToExcel } from "../utils/exportToExcel";

interface ReportModalProps {
  open: boolean;
  handleClose: () => void;
  setReportName: (name: string) => void;
  reportName: string;
  rows: any;
}

export function ReportModal({
  open,
  handleClose,
  setReportName,
  reportName,
  rows,
}: ReportModalProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          exportToExcel(rows, reportName);
          handleClose();
        },
      }}
    >
      <DialogTitle>Export Report</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "350px" }}
      >
        <DialogContentText>Enter your report name</DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="reportName"
          name="reportName"
          label="Report Name"
          placeholder="e.g CoronaVirus Report"
          type="text"
          value={reportName}
          onChange={(e: any) => setReportName(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
}

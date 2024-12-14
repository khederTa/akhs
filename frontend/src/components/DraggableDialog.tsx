import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import {
  Box,
  FormControl,
  FormLabel,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

type DraggableDialogProps = {
  open: boolean;
  handleClose: () => void;
  onConfirm: () => void;
};

export default function DraggableDialog({
  open,
  handleClose,
  onConfirm,
}: DraggableDialogProps) {
  const [typedText, setTypedText] = React.useState("");
  const [typedTextError, setTypedTextError] = React.useState(false);
  const [typedTextErrorMessage, setTypedTextErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setIsValidText] = React.useState(false);
  const { t } = useTranslation();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    setIsLoading(true);

    try {
      await onConfirm(); // Await confirmation to ensure action is completed
      setTypedText("");
      handleClose();
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!typedText || typedText.length === 0) {
      setTypedTextError(true);
      setTypedTextErrorMessage(t("please enter 'delete' to confirm"));
      isValid = false;
    } else if (typedText.toLowerCase() !== t("delete").toLowerCase()) {
      setTypedTextError(true);
      setTypedTextErrorMessage(t("the typed text must be 'delete'"));
      isValid = false;
    } else {
      setTypedTextError(false);
      setTypedTextErrorMessage("");
    }
    setIsValidText(isValid);
    return isValid;
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        fullWidth={true}
        maxWidth={"xs"} // Set dialog size to 'small'
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: 2, // Add some padding for better spacing
          }}
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            {t("delete confirmation")}
          </DialogTitle>
          <DialogContent sx={{ padding: "0px 8px" }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="text">
                {t("please enter 'delete' to confirm")}
              </FormLabel>
              <TextField
                error={typedTextError}
                helperText={typedTextErrorMessage}
                id="text"
                type="text"
                name="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder={t("delete")}
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={typedTextError ? "error" : "primary"}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} disabled={isLoading}>
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              onClick={validateInputs}
              color="error"
              sx={{
                backgroundColor: isLoading ? "grey.400" : "error.main",
                color: "white",
              }}
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? t("deleting...") : t("delete")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}

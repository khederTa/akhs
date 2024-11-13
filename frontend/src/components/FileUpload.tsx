/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  UploadFile as UploadFileIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "../utils/axios";
import { useTranslation } from "react-i18next";

type UploadedFile = {
  file: File;
  progress: number;
};

type FileUploadProps = {
  fileId: number | null;
  setFileId: (fileId: number | null) => void;
  setUpdatedFile?: (file: any) => void;
  mode?: string;
  setUploadFileSizeError?: (value: string) => void;
};
const FileUpload = ({
  fileId,
  setFileId,
  setUpdatedFile,
  mode,
  setUploadFileSizeError,
}: FileUploadProps): JSX.Element => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [fileError, setFileError] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const { t } = useTranslation();
  // console.log(fileId, mode);
  const handleFileUpload = async (base64FileData: string) => {
    try {
      if (mode === "edit") {
        let response;
        if (fileId) {
          response = await axios.put(`file/${fileId}`, {
            fileData: base64FileData,
          });
        } else {
          response = await axios.post("file", {
            fileData: base64FileData,
          });
        }
        console.log({ data: response.data });
        if (setUpdatedFile) setUpdatedFile(response.data.file);
        setFileId(response.data.fileId);
        setFileError(false);
        setFileErrorMessage("");
      } else {
        if (fileId) await deleteFile(false); // Delete old file if present
        const response = await axios.post("file", { fileData: base64FileData });
        setFileId(response.data.fileId);
        setFileError(false);
        setFileErrorMessage("");
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setFileError(true);
      setFileErrorMessage("your file size must be 2MB or less");
      if (setUploadFileSizeError)
        setUploadFileSizeError("your file size must be 2MB or less");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const newUploadedFile = { file, progress: 0 };
    setUploadedFile(newUploadedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      if (base64Data) handleFileUpload(base64Data);
    };
    reader.readAsDataURL(file);

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + 10, 100);
      setUploadedFile((prevFile) =>
        prevFile ? { ...prevFile, progress } : null
      );
      if (progress === 100) clearInterval(interval);
    }, 300);
  };

  const deleteFile = async (clearFile: boolean = true) => {
    try {
      const response = await axios.delete(`file/${fileId}`);
      if (response.status === 200) {
        setFileId(null);
        if (clearFile) setUploadedFile(null);
      }
    } catch (error) {
      console.error("File deletion failed:", error);
    }
  };

  return (
    <>
      {mode === "edit" ? (
        <IconButton component="label">
          <UploadFileIcon />
          <input type="file" hidden onChange={handleFileChange} />
        </IconButton>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            {t("upload your resume")}
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          <List>
            {uploadedFile && !fileError ? (
              <ListItem
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteFile(true)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={uploadedFile.file.name}
                  secondary={`${uploadedFile.progress}%`}
                />
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadedFile.progress}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
              </ListItem>
            ) : (
              <Typography color="error">{t(fileErrorMessage)}</Typography>
            )}
          </List>
        </Box>
      )}
    </>
  );
};

export default FileUpload;

import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  UploadFile as UploadFileIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "../utils/axios";

type UploadedFile = {
  file: File;
  progress: number;
};

type FileUploadProps = {
  fileId?: number;
  setFieldId: (fileId: number) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ setFieldId }) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const onUpload = async (base64FileData: string) => {
    try {
      const response = await axios.post("file", { fileData: base64FileData });
      setFieldId(response.data.fileId); // Assume backend returns fileId in response
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newUploadedFile = { file, progress: 0 };
      setUploadedFile(newUploadedFile);

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        if (onUpload && base64Data) {
          onUpload(base64Data);
        }
      };
      reader.readAsDataURL(file); // Converts file to base64 string

      // Start simulating upload progress
      simulateUploadProgress(newUploadedFile);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const simulateUploadProgress = (_uploadedFile: UploadedFile) => {
    const interval = setInterval(() => {
      setUploadedFile((prevFile) => {
        if (!prevFile) return null;
        const currentProgress = prevFile.progress;
        if (currentProgress < 100) {
          return { ...prevFile, progress: Math.min(currentProgress + 10, 100) };
        } else {
          clearInterval(interval);
          return prevFile;
        }
      });
    }, 300);
  };

  const handleFileDelete = () => {
    setUploadedFile(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadFileIcon />}
      >
        Upload File
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      <List>
        {uploadedFile && (
          <ListItem
            secondaryAction={
              <IconButton edge="end" onClick={handleFileDelete}>
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
        )}
      </List>
    </Box>
  );
};

export default FileUpload;

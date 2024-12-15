import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { SaveAlt as SaveAltIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

type DownloadButtonProps = {
  fileBinary: number[] | null;
  fileName: string;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({
  fileBinary,
  fileName,
}) => {
  const { t } = useTranslation();
  const handleDownload = () => {
    if (!fileBinary || fileBinary.length === 0) {
      console.error("No file data available for download.");
      return;
    }

    try {
      // Convert fileBinary to Uint8Array for Blob creation
      const byteArray = new Uint8Array(fileBinary);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create a temporary download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download.pdf";
      document.body.appendChild(a);

      // Trigger download and cleanup
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Tooltip title={t("download CV")}>
      <IconButton
        onClick={handleDownload}
        disabled={!fileBinary || fileBinary.length === 0}
      >
        <SaveAltIcon />
      </IconButton>
    </Tooltip>
  );
};

export default DownloadButton;

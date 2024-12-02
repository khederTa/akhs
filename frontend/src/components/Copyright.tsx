/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export default function Copyright(props: any) {
  const { t } = useTranslation();
  return (
    <Typography
      variant="body2"
      align="center"
      {...props}
      sx={[
        {
          color: "text.secondary",
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {t("Copyright © ")}
      <Link color="inherit" href="#">
        {t("Aga Khan For Health Services")}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

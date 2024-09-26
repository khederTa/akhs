import { CircularProgress, CircularProgressProps, Stack } from "@mui/material";
import { JSX } from "react/jsx-runtime";

export function Loading(props: JSX.IntrinsicAttributes & CircularProgressProps) {
  return (
    <Stack
      spacing={2}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100vh" }}
    >
      <CircularProgress
        variant="determinate"
        sx={(theme) => ({
          color: theme.palette.grey[500],
          ...theme.applyStyles("dark", {
            color: theme.palette.grey[500],
          }),
        })}
        size={"5rem"}
        thickness={5}
        {...props}
        value={100}
      />
    </Stack>
  );
}

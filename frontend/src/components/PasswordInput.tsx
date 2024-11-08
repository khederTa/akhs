/* eslint-disable @typescript-eslint/no-explicit-any */
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

const PasswordInput = ({
  label,
  passwordError,
  passwordErrorMessage,
  onChange,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      label={label}
      size="small"
      type={showPassword ? "text" : "password"}
      name="password"
      id="password"
      required={true}
      error={passwordError}
      helperText={passwordErrorMessage}
      color={passwordError ? "error" : "primary"}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
              sx={{
                border: "none",
                height: "0px",
                backgroundColor:
                  "var(--template-palette-background-default) !important",
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      fullWidth
    />
  );
};

export default PasswordInput;

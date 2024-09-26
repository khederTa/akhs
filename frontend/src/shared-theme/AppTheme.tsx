/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { ThemeProvider, createTheme, Direction } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
// import { prefixer } from "stylis";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/dataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";
import i18n from "../i18n"; // Adjust the import path as necessary

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export const DIRECTION_ACTIONS = {
  TOGGLE_DIRECTION: "TOGGLE_DIRECTION",
};

export const DirectionContext = React.createContext({
  direction: "ltr", // Default to LTR
  dispatchDirection: (action: { type: string; payload: string }) => {}, // Placeholder function
});

function directionReducer(
  state: { direction: string },
  action: { type: string; payload: string }
) {
  switch (action.type) {
    case DIRECTION_ACTIONS.TOGGLE_DIRECTION:
      return {
        ...state,
        direction: action.payload === "ar" ? "rtl" : "ltr",
      };
    default:
      return state;
  }
}

export default function AppTheme({
  children,
  disableCustomTheme,
  themeComponents,
}: AppThemeProps) {
  // State for direction based on current language
  const [directionState, dispatchDirection] = React.useReducer(
    directionReducer,
    {
      direction: i18n.language === "ar" ? "rtl" : "ltr",
    }
  );

  // Create the RTL or LTR cache based on the current direction
  const rtlCache = createCache({
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
  });

  const ltrCache = createCache({
    key: "mui",
  });

  // Update the theme with the new direction
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          direction: directionState.direction as Direction, // Add direction to the theme
          cssVariables: {
            colorSchemeSelector: "data-mui-color-scheme",
            cssVarPrefix: "template",
          },
          colorSchemes,
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents, directionState.direction]);

  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <DirectionContext.Provider
      value={{
        direction: directionState.direction,
        dispatchDirection: dispatchDirection,
      }}
    >
      <CacheProvider value={i18n.language === "ar" ? rtlCache : ltrCache}>
        <ThemeProvider theme={theme} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </CacheProvider>
    </DirectionContext.Provider>
  );
}
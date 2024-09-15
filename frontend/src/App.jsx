import { createContext, useEffect, useReducer, useState } from "react";
import useDarkMode from "./components/useDarkMode/useDarkMode";
import "./index.css";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./components/useLanguage/useLanguage"; // Adjust the import path
import { Navbar } from "./components/navbar/Navbar";
import { Login } from "./components/login/Login";
import { Register } from "./components/register/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageContainer } from "./components/pageContainer/PageContainer";
import { setUser } from "./utils/auth";

// Set default values for contexts
export const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const LanguageContext = createContext({
  language: "en",
  switchLanguage: () => {},
});

const DARK_MODE_ACTIONS = {
  SET_DARK_MODE: "SET_DARK_MODE",
};

function darkModeReducer(state, action) {
  switch (action.type) {
    case DARK_MODE_ACTIONS.SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload,
      };
    default:
      return state;
  }
}

const LANGUAGE_ACTIONS = {
  TOGGLE_LANGUAGE: "TOGGLE_LANGUAGE",
};

function languageReducer(state, action) {
  switch (action.type) {
    case LANGUAGE_ACTIONS.TOGGLE_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
}

function App() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [language, toggleLanguage] = useLanguage();
  const [darkModeState, dispatchDarkMode] = useReducer(darkModeReducer, {
    darkMode,
  });
  const [languageState, dispatchLanguage] = useReducer(languageReducer, {
    language,
  });

    useEffect(() => {
      setUser();
    }, []);

  function toggleDarkMode() {
    const newDarkMode = !darkModeState.darkMode;
    setDarkMode(newDarkMode);
    dispatchDarkMode({
      type: DARK_MODE_ACTIONS.SET_DARK_MODE,
      payload: newDarkMode,
    });
  }

  function switchLanguage() {
    const newLanguage = language === "en" ? "ar" : "en";
    toggleLanguage(newLanguage);
    dispatchLanguage({
      type: LANGUAGE_ACTIONS.TOGGLE_LANGUAGE,
      payload: newLanguage,
    });
  }

  const { t } = useTranslation();

  useEffect(() => {
    if (darkModeState.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkModeState.darkMode]);

  return (
    <BrowserRouter>
      <DarkModeContext.Provider value={{ ...darkModeState, toggleDarkMode }}>
        <LanguageContext.Provider value={{ ...languageState, switchLanguage }}>
          <Routes>
            <Route
              path="/"
              element={
                <PageContainer>
                  <h2>{t("welcome to the dashboard")}</h2>
                </PageContainer>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <Login />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Navbar />
                  <Register />
                </>
              }
            />
          </Routes>
        </LanguageContext.Provider>
      </DarkModeContext.Provider>
    </BrowserRouter>
  );
}

export default App;

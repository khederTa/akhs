import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ProSidebarProvider } from "react-pro-sidebar";
import "./styles.css"
import Register from "./components/register/Register.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProSidebarProvider>
      <App />
    </ProSidebarProvider>

      {/* <Register /> */}
  </React.StrictMode>
);

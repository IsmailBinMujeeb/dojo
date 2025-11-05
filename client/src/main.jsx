import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext";

createRoot(document.getElementById("root")).render(
  // In strict mode the ws message were sending twice
  // <StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>,
  // </StrictMode>,
);

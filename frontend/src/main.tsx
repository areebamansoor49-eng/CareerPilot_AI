import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./style.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  throw new Error("Google Client ID not found. Check your .env file.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);